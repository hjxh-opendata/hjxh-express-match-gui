import io
import json
import logging
import os
import re
from datetime import date, datetime, timedelta
from logging import WARN, Logger, error, log
from typing import Dict, List, Tuple, Union

import pandas as pd
from fastapi.datastructures import UploadFile
from fastapi.param_functions import Query
from pandas.core.algorithms import isin
from pandas.tseries.offsets import Second
from pymongo.errors import BulkWriteError, DuplicateKeyError

from ..base import ErrorType, Status
from ..config import (COLL_TRD_PREFIX, TRD_FALLBACK_COLUMNS,
                      TRD_FALLBACK_COLUMNS_WITH_SHIPMENT,
                      TRD_FILETYPES_ALLOWED, TRD_ID_KEY, TRD_SHEETNAME_PATTERN,
                      TRD_SHIPTIME_KEY)
from ..db.conn import db, push_db
from ..db.doc_trd import (MAX_SAMPLE, TrdInsertEDoc, TrdReadEDoc,
                          TrdRequestEDoc, TrdStatDoc, TrdWashEDoc)
from ..my_log import MyLogger
from ..utils.extract_csv import extract_csv_into_bytes


def push_msg(msg:  Union[str, list, dict], logger: Logger = MyLogger, level: int = logging.DEBUG,  data: dict = None):
    logger.log(level, msg)
    if data:
        assert isinstance(msg, dict), "数据结构中，只支持接收字典项"
        data.update(msg)


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
        assert s.str.match(r'.*\d{4}.\d\d').all(), '不匹配日期格式'
        return s.str.replace(r'^.*(\d{4}).(\d\d).*$', r'\1-\2', regex=True)

    assert s.dtype == float, '未知格式'
    assert s.apply(lambda x: 4e4 < x < 5e4).all(), '日期不匹配'
    # FIXME: 这里的x - 2是一个试出来的无奈的选择，具体先看看其他有可能错的吧。。。
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
    data = dict()

    try:
        # 文件类型判定
        MyLogger.debug("file name: " + file.filename)
        data["fileName"] = file.filename
        assert os.path.splitext(file.filename)[
            1] in TRD_FILETYPES_ALLOWED, f"只支持以下文件类型：{TRD_FILETYPES_ALLOWED}"

        b = io.BytesIO(file.file.read())
        MyLogger.debug(f"file size: {b.__sizeof__}b")

        # 读取文件
        if file.filename.endswith(".xls"):
            wb = pd.ExcelFile(b)
            MyLogger.debug(
                f".xls -> pd is reading, sheet names: {wb.sheet_names}")
            for sheet_name in wb.sheet_names:
                if re.match(TRD_SHEETNAME_PATTERN, sheet_name):
                    b.seek(0)
                    df = pd.read_excel(b, sheet_name=sheet_name)
                    break
            else:
                raise Exception(ErrorType.SheetMiss)
        else:
            # refer: 【pandas使用遇到的问题】 have mixed types. Specify dtype option on import or set low_memory=False._程序的尽头是数学，一日不推导赶不上买买提-CSDN博客_low_memory=false, https://blog.csdn.net/u010212101/article/details/78017924
            buffer = extract_csv_into_bytes(b)
            df = pd.read_csv(buffer, low_memory=False)
        MyLogger.debug("read finished")

        ##
        #   PART III, Wash
        ##
        MyLogger.debug(f"columns: {df.columns.tolist()}")
        # 去除Unnamed列
        df.drop(columns=list(
            filter(lambda x: x.startswith("Unname"), df.columns)), inplace=True)

        # 检查字段是否缺失
        trd_fallback_columns = TRD_FALLBACK_COLUMNS if year_month else TRD_FALLBACK_COLUMNS_WITH_SHIPMENT
        columns_map = dict(match_column(choices, df.columns.tolist())
                           for choices in trd_fallback_columns)

        key_map = dict((j, i) for (i, j) in columns_map.items())
        MyLogger.debug(f"key_map: f{key_map}")
        df = df[columns_map.keys()]  # type: pd.DataFrame
        data["keyMap"] = key_map
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
        MyLogger.debug(f"rows of raw: {len(df)}")
        data["nRowsOfRaw"] = len(df)
        df.dropna(inplace=True, axis=0)
        MyLogger.debug(f"rows after dropping nan: {len(df)}")
        data["nRowsWithoutNa"] = len(df)

        # 判断ID列是否唯一
        ids = df[TRD_ID_KEY]
        if not ids.is_unique:
            duplicate_ids = ids[ids.duplicated()]    # type: pd.Series
            d_info = {
                "duplicate count": duplicate_ids.__len__(),
                "duplicate sample": duplicate_ids[:MAX_SAMPLE]
            }
            MyLogger.debug(f"id column is not unique, duplicate: {d_info}")
            df.drop_duplicates(subset=[TRD_ID_KEY], inplace=True)
            MyLogger.debug(f"rows after dropping nan: {len(df)}")
            raise Exception(ErrorType.ID_NOT_UNIQUE, d_info)
        else:
            MyLogger.debug("all the ids are unique~")

        MyLogger.debug(f"try to insert {len(df)} items into db")

        ##
        #   PART IV, Insert
        ##
        df.rename(columns={TRD_ID_KEY: "_id"}, inplace=True)  # _id插入数据库
        # 指定表名后的批量插入，优点速度快，缺点是可能有条目的实际发货时间与表名不符，并且用户有输错概率
        if year_month:
            assert re.fullmatch(
                r"\d{4}-\d{2}", year_month), f"指定表名必须以`YYYY-MM`格式"
            year_month = COLL_TRD_PREFIX + year_month
            try:
                # insert_many 成功后，不会返回nInserted之类的字段，毕竟它理解为全部成功了（失败时有必要返回这个字段），所以我们直接补一个inserted结构
                db[year_month].insert_many(
                    df.to_dict("records"), ordered=False)
                push_msg({"nInserted": "all"}, data=data)
            # 当批量插入报错时，不能打印e.args，因为它会显示所有插入错误的条目，导致程序死机
            except BulkWriteError as e:
                MyLogger.debug("occurred BulkWriterError")
                errors = e.details.pop("writeErrors") + \
                    e.details.pop("writeConcernErrors")
                error_id_sample = [i["keyValue"]["_id"]
                                   for i in errors[:MAX_SAMPLE]]
                push_msg(e.details, data=data, level=WARN)
                push_msg(
                    {"error_id_sample": error_id_sample}, data=data, level=WARN)

        # 不指定表名，系统解析每条数据的实际发货时间，精准，但是速度很慢
        else:
            MyLogger.debug("try to insert via item and infer date column")
            # 基于发货日期，进行正则分列，之所以不直接使用切片，是有可能是="xx"形式
            # 然而分列方法并不够好，摸索了一下，用replace最好，refer： https://stackoverflow.com/a/62011205/9422455
            df["coll_name"] = COLL_TRD_PREFIX + \
                extract_date_str(df[TRD_SHIPTIME_KEY])
            year_month_set = set(df["coll_name"])
            m_info = {
                "count": len(year_month_set),
                "sample": list(year_month_set)[:MAX_SAMPLE]
            }
            MyLogger.debug(f"year_month(coll_name) detected: {m_info}")
            # 由于未选定日期列，导致可能表名太多，需要在客户端阻止
            assert len(m_info) == 1, f"year months too much: {m_info}"

            # 导入数据库
            nInserted = nDuplicated = 0
            for (index, row) in df.iterrows():
                try:
                    db[row["coll_name"]].insert_one(
                        row.drop(columns=["coll_name"]).to_dict())
                    nInserted += 1
                except DuplicateKeyError as e:
                    nDuplicated += 1
            MyLogger.debug(
                {"nInserted": nInserted, "nDuplicated": nDuplicated})

    except Exception as e:
        data["status"] = Status.ERROR
        data["msg"] = e.args

    else:
        data["status"] = Status.OK
    finally:
        push_db(data)
        return data
