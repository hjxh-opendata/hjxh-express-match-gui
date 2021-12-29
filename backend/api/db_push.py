import os
from datetime import datetime
from enum import Enum
from typing import List, Union

import pandas as pd
from fastapi import APIRouter, Query
from pydantic import BaseModel

from config import COLL_STAT_NAME, COLL_DETAIL_NAME, COLL_CONFIRM_NAME
from const import RequestUrl, ResponseModel, ErrorType, ResponseStatus
from db import db
from log import log
from utils import _get_df_file_path, _try_to_get_file_stand

router_push_db = APIRouter()


class ConfirmOperation(Enum):
    confirmed = "confirmed"
    rejected = "rejected"
    closed = "closed"


class ConfirmModel(BaseModel):
    file_name: str
    notes: List[str]
    rows: List[int]
    update_time: datetime
    operation: ConfirmOperation

    # reference: https://stackoverflow.com/a/65211727/9422455
    class Config:
        use_enum_values = True  # since ConfirmOperation is an Enum


@router_push_db.post(RequestUrl.URL_CONFIRM_FILE, response_model=ResponseModel)
async def confirm_file(data: ConfirmModel):
    log.debug(data)
    print("confirming file push")
    db[COLL_CONFIRM_NAME].insert_one(data.dict())
    return {
        "status": ResponseStatus.OK
    }


@router_push_db.get(RequestUrl.PUSH_DB, response_model=ResponseModel)
async def push_db(file_name: str):
    pack = {}
    file_path = _get_df_file_path(file_name)
    if not os.path.exists(file_path):
        raise Exception(ErrorType.FileNotExisted, {"file_name": file_name})

    file_stand = _try_to_get_file_stand(file_name)
    df = pd.read_csv(file_path)
    ### 1. 加上文件名与日期名
    df["file_name"] = file_name
    df["update_time"] = datetime.now()

    ### 2. 加上stand后缀
    df.rename(columns=dict((i, i + "_" + file_stand) for i in df.columns if i != "_id"), inplace=True)

    ### 3. 设置index，并插入表
    df.set_index("_id", inplace=True)
    nUpserted = nMatched = nModifed = 0
    for (index, row) in df.iterrows():
        # 在result中，如果没有match就要upsert，如果match了，就要尝试修改，但很有可能数据是相同的，所以就会modified为0
        result = db[COLL_DETAIL_NAME].update_one({"_id": index}, {"$set": dict(row)}, upsert=True)
        if result.upserted_id:
            nUpserted += 1
        nMatched += result.matched_count
        nModifed += result.modified_count
    pack["db_record"] = d = {"nUpserted": nUpserted, "nMatched": nMatched, "nModified": nModifed}
    log.debug(d)

    ### 4. 抄送汇总信息倒stat表
    db[COLL_STAT_NAME].insert_one({**pack, "update_time": datetime.now()})
    log.debug(f"saved synchronized into coll of {COLL_STAT_NAME}")

    return {
        "status": ResponseStatus.OK,
        "data": pack
    }
