import io
import json
from logging import error
import os
import re
from datetime import date, datetime, timedelta
from typing import List, Tuple

import pandas as pd
from fastapi.datastructures import UploadFile
from fastapi.param_functions import Query
from pandas.core.algorithms import isin
from pandas.tseries.offsets import Second
from pymongo.errors import BulkWriteError, DuplicateKeyError

from ..core.base import ErrorType, Status
from ..core.config import (COLL_TRD_PREFIX, TRD_FALLBACK_COLUMNS,
                      TRD_FALLBACK_COLUMNS_WITH_SHIPMENT,
                      TRD_FILETYPES_ALLOWED, TRD_ID_KEY, TRD_SHEETNAME_PATTERN,
                      TRD_SHIPTIME_KEY)
from ..core.db.conn import db, push_msg
from ..core.db.doc_trd import (MAX_SAMPLE, TrdInsertEDoc, TrdReadEDoc, TrdRequestEDoc, TrdWashEDoc,
                          TrdStatDoc)
from ..core.utils.extract_csv import extract_csv_into_bytes


def extract_date_str(s: pd.Series) -> pd.Series:
    """从Series中提取出YYYY-MM结构

    1. s为NaN，不存在，已经提前被df.dropna()了
    2. s为正常YYYY-MM-DD ... 结构
    3. s为变体YYYY/MM/DD ... 结构
    4. s为1900年起浮点或整数，即4w+的数（Excel Style）
    5. s为datetime / date数据结构，不存在，用pandas读取不会自动转格式
    6. s为其他形式，不存在
    """
    assert s.notna().all(), f'有空'
    if s.dtype in [str, object]:
        assert s.str.match('.*\d{4}.\d\d').all(), '不匹配日期格式'
        return s.str.replace(r'^.*(\d{4}).(\d\d).*$', r'\1-\2', regex=True)

    assert s.dtype == float, '未知格式'
    assert s.apply(lambda x: 4e4 < x < 5e4).all(), '日期不匹配'
    # IMPROVE: 这里的x - 2是一个试出来的无奈的选择，具体先看看其他有可能错的吧。。。
    return s.apply(lambda x: (datetime(1900, 1, 1) + timedelta(days=x-2)).strftime('%Y-%m'))


def match_column(target_choices: Tuple[str], df_columns: List[str]) -> Tuple[str, str]:
    # 一定要choice再前，column在后，这样才能保证优先级，例如常州顺丰的发货时间和支付时间问题
    for choice in target_choices:
        for column in df_columns:
            if choice in column:
                return (column, target_choices[0])
    else:
        print(
            f"missing column choices: {target_choices}, the columns: {df_columns}")
        raise Exception(ErrorType.ColumnMiss)


async def upload_trd(file: UploadFile, year_month: str = None):

    ##
    #   Part I, request
    ##

    print(f"reading file: {file.filename}")
    trd_request_doc = TrdRequestEDoc(year_month=year_month)
    trd_read_doc = TrdReadEDoc(fileName=file.filename)
    trd_wash_doc = TrdWashEDoc()
    trd_insert_doc = TrdInsertEDoc()
    trd_stat_doc = TrdStatDoc(
        trdRequest=trd_request_doc,
        trdRead=trd_read_doc,
        trdWash=trd_wash_doc,
        trdInsert=trd_insert_doc
    )

    ##
    #   Part II, read
    ##

    try:
        # 文件类型判定
        assert os.path.splitext(file.filename)[
            1] in TRD_FILETYPES_ALLOWED, f"只支持以下文件类型：{TRD_FILETYPES_ALLOWED}"

        trd_read_doc.fileReadStartTime = datetime.now()
        b = io.BytesIO(file.file.read())
        trd_read_doc.fileSize = b.__sizeof__()
        # 读取文件
        if file.filename.endswith(".xls"):
            wb = pd.ExcelFile(b)
            for sheet_name in wb.sheet_names:
                if re.match(TRD_SHEETNAME_PATTERN, sheet_name):
                    b.seek(0)
                    df = pd.read_excel(b, sheet_name=sheet_name)
                    break
            else:
                raise Exception(ErrorType.SheetMiss)
        else:
            # refer: 【pandas使用遇到的问题】 have mixed types. Specify dtype option on import or set low_memory=False._程序的尽头是数学，一日不推导赶不上买买提-CSDN博客_low_memory=false, https://blog.csdn.net/u010212101/article/details/78017924
            df = pd.read_csv(extract_csv_into_bytes(b), low_memory=False)

        trd_read_doc.fileReadEndTime = datetime.now()

        ##
        #   PART III, Wash
        ##
        trd_wash_doc.raw_columns = df.columns.to_list()
        # 去除Unnamed列
        df.drop(columns=list(
            filter(lambda x: x.startswith("Unname"), df.columns)), inplace=True)

        # 检查字段是否缺失
        trd_fallback_columns = TRD_FALLBACK_COLUMNS if year_month else TRD_FALLBACK_COLUMNS_WITH_SHIPMENT
        columns_map = dict(match_column(choices, df.columns)
                           for choices in trd_fallback_columns)

        trd_wash_doc.key_map = dict((j, i) for (i, j) in columns_map.items())
        df = df[columns_map.keys()]  # type: pd.DataFrame
        df.rename(columns=columns_map, inplace=True)

        """
        以下算法是不行的，既过于复杂也过于细节了，不如多删点，但凡出现目标列里有空就删，最后match完了之后，在erp里找还有没match的，再回过头来看表是啥问题，就行了~
            # 先丢掉空id行
            df.dropna(subset=[TARGET_TRD_ID_KEY], inplace=True)
            # 再删除一些不正常的id行，例如【汇总】行，例如：常州极兔
            while len(str(df.iloc[-1][TARGET_TRD_ID_KEY])) < 5:
                print(
                    f"dropping the last row since id=[{df.iloc[-1][TARGET_TRD_ID_KEY]}]")
                df = df[:-1]
            # 检查各列是否都不为空
            for column in df.columns:
                s = df[column].isna().sum()
                assert s == 0, (ErrorType.ColumnNaN, f'列[{column}]存在{s}个缺失值')
        直接暴力删！
        """
        trd_wash_doc.nRowsOfRaw = df.__len__()
        df.dropna(inplace=True, axis=0)
        trd_wash_doc.nRowsOfNotNa = df.__len__()

        # 判断ID列是否唯一
        ids = df[TRD_ID_KEY]
        if not ids.is_unique:
            trd_wash_doc.isIdUnique = False
            trd_wash_doc.duplicatedIdSample = ids[ids.duplicated()].head(
            ).to_list()
            df.drop_duplicates(subset=[TRD_ID_KEY], inplace=True)
            trd_wash_doc.nRowsOfUnique = df.__len__()
            raise Exception(ErrorType.ID_NOT_UNIQUE, {
                "duplicate id samples": trd_wash_doc.duplicatedIdSample
            })
        else:
            trd_wash_doc.isIdUnique = True
            trd_wash_doc.nRowsOfUnique = trd_wash_doc.nRowsOfNotNa

        print(f"try to insert {trd_wash_doc.nRowsOfUnique} items into db")

        ##
        #   PART IV, Insert
        ##

        trd_insert_doc.nToInsert = trd_wash_doc.nRowsOfNotNa
        trd_insert_doc.startTime = datetime.now()
        df.rename(columns={TRD_ID_KEY: "_id"}, inplace=True)  # _id插入数据库
        # 指定表名后的批量插入，优点速度快，缺点是可能有条目的实际发货时间与表名不符，并且用户有输错概率
        if year_month:
            assert re.fullmatch(
                "\d{4}-\d{2}", year_month), f"指定表名必须以`YYYY-MM`格式"
            year_month = COLL_TRD_PREFIX + year_month
            try:
                # insert_many 成功后，不会返回nInserted之类的字段，毕竟它理解为全部成功了（失败时有必要返回这个字段），所以我们直接补一个inserted结构
                db[year_month].insert_many(
                    df.to_dict("records"), ordered=False)
                trd_insert_doc.nInserted = trd_insert_doc.nToInsert
                trd_insert_doc.nDuplicated = 0
            # 当批量插入报错时，不能打印e.args，因为它会显示所有插入错误的条目，导致程序死机
            except BulkWriteError as e:
                trd_insert_doc.nInserted = e.details["nInserted"]
                # 返回的数据结构，只有一个列表，还有一个writeConcernErrors不知道啥意思
                possible_duplicates = e.details["writeErrors"] + \
                    e.details["writeConcernErrors"]
                trd_insert_doc.nDuplicated = len(possible_duplicates)
                trd_insert_doc.duplicateSample = possible_duplicates[:MAX_SAMPLE]

        # 不指定表名，系统解析每条数据的实际发货时间，精准，但是速度很慢
        else:
            trd_insert_doc.nInserted = 0
            # 基于发货日期，进行正则分列，之所以不直接使用切片，是有可能是="xx"形式
            # 然而分列方法并不够好，摸索了一下，用replace最好，refer： https://stackoverflow.com/a/62011205/9422455
            df["coll_name"] = COLL_TRD_PREFIX + \
                extract_date_str(df[TRD_SHIPTIME_KEY])
            trd_insert_doc.collNames = list(set(df["coll_name"]))
            # 由于未选定日期列，导致可能表名太多，需要在客户端阻止
            assert len(trd_insert_doc.collNames
                       ) == 1, f"colls too many: {trd_insert_doc.collNames}"

            # 导入数据库
            for (index, row) in df.iterrows():
                try:
                    db[row["coll_name"]].insert_one(
                        row.drop(columns=["coll_name"]).to_dict())
                    trd_insert_doc.nInserted += 1
                except DuplicateKeyError as e:
                    trd_insert_doc.nDuplicated += 1

    except Exception as e:
        return {
            "status": Status.ERROR,
            "msg": e.args,
            "data": trd_stat_doc.to_json()
        }
    else:
        return {
            "status": Status.OK,
            "data": json.loads(trd_stat_doc.to_json())
        }
    finally:
        trd_stat_doc.save()
