import io
import os
import re
from fastapi.param_functions import Query

import pandas as pd
from fastapi.datastructures import UploadFile
from pymongo.errors import BulkWriteError, DuplicateKeyError

from base import Status
from config import COLL_TRD_PREFIX, TARGET_TRD_SHIPTIME_KEY, UPLOAD_TRD_COLUMNS, UPLOAD_TRD_FILETYPES_ALLOWED, TARGET_TRD_ID_KEY
from db import db
from utils import guess_encoding


async def upload_trd(file: UploadFile, sheet_name: str, year_month: str = None):
    print(f"processing file: {file.filename}")
    item = {
        "filename": file.filename,
        "year_month": year_month
    }
    try:
        # 文件类型判定
        assert os.path.splitext(file.filename)[
            1] in UPLOAD_TRD_FILETYPES_ALLOWED, f"只支持以下文件类型：{UPLOAD_TRD_FILETYPES_ALLOWED}"

        # 读取文件
        df = pd.read_excel(io.BytesIO(file.file.read()), sheet_name=sheet_name)
        file.file.close()

        # 去除Unnamed列
        df.drop(columns=list(
            filter(lambda x: x.startswith("Unname"), df.columns)), inplace=True)

        # 检查字段是否缺失
        missing_coumns_set = set(UPLOAD_TRD_COLUMNS) - set(df.columns)
        assert missing_coumns_set.__len__(
        ) == 0, f"该表缺失以下字段：{missing_coumns_set}"
        df = df[UPLOAD_TRD_COLUMNS]

        # 检查物流单号是否都有
        # assert df["物流单号"].isna().sum() == 0, f"物流单号列有缺失数据"
        # 不检查了，发现用户有时候可能会有汇总行，导致为空，所以直接dropna就可以了
        df.dropna(subset=[TARGET_TRD_ID_KEY], inplace=True)
        item["nRows"] = df.__len__()

        # TRD表不需要分组处理

        # 这里用_id标记，而不用set_index是因为在df中有没有id是不重要的，重要的是插入数据库后的_id
        df["_id"] = df[TARGET_TRD_ID_KEY]
        # item['express_companies'] = set(df['快递公司'])
        print(f"rows: {item['nRows']}")

        # 指定表名后的批量插入，优点速度快，缺点是可能有条目的实际发货时间与表名不符，并且用户有输错概率
        if year_month:
            assert re.fullmatch(
                "\d{4}-\d{2}", year_month), f"指定表名必须以`YYYY-MM`格式"
            year_month = COLL_TRD_PREFIX + year_month
            item["coll_name"] = year_month

            try:
                # insert_many 成功后，不会返回nInserted之类的字段，毕竟它理解为全部成功了（失败时有必要返回这个字段），所以我们直接补一个inserted结构
                db[year_month].insert_many(
                    df.to_dict("records"), ordered=False)
                item["nInserted"] = df.__len__()
            # 当批量插入报错时，不能打印e.args，因为它会显示所有插入错误的条目，导致程序死机
            except BulkWriteError as e:
                item["nInserted"] = e.details["nInserted"]

        # 不指定表名，系统解析每条数据的实际发货时间，精准，但是速度很慢
        else:
            item["nInserted"] = item["nDuplicated"] = 0
            # 基于发货日期，进行正则分列，之所以不直接使用切片，是有可能是="xx"形式
            df["coll_name"] = COLL_TRD_PREFIX + df[TARGET_TRD_SHIPTIME_KEY].str.extract(
                '(\d{4}-\d{2})', expand=False)  # 获取发货的年月"YYYY-MM"

            # 导入数据库
            for (index, row) in df.iterrows():
                try:
                    db[row["coll_name"]].insert_one(
                        row.drop(columns=["coll_name"]).to_dict())
                    item["nInserted"] += 1
                except DuplicateKeyError as e:
                    item["nDuplicated"] += 1
            item["coll_names"] = set(df["coll_name"])

    except Exception as e:
        item["status"] = Status.ERROR
        item["msg"] = e.args
    else:
        item["status"] = Status.OK
    return item
