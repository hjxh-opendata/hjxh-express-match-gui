from typing import Union
import pymongo
from datetime import date, datetime, timedelta, timezone, tzinfo
from copy import deepcopy


from .config import COLL_MESSAGES, DATABASE_NAME

uri = pymongo.MongoClient()
db = uri[DATABASE_NAME]


def push_msg(item: dict):
    assert isinstance(item, dict), "确保消息是一个字典，而非列表等数据结构"
    item["_datetime"] = datetime.now()
    db[COLL_MESSAGES].insert_one(deepcopy(item))
