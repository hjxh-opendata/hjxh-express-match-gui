from enum import Enum
from typing import Union

from fastapi import APIRouter, Query, Body

from config import COLL_DETAIL_NAME
from const import ResponseStatus, ErrorType, RequestUrl
from db import db
from log import log

router_db_query = APIRouter()


class QueryType(Enum):
    ErpMissing = "ErpMissing"
    TrdMissing = "TrdMissing"
    AreaMismatch = "AreaMismatch"
    DateMismatch = "DateMismatch"
    WeightMismatch = "WeightMismatch"


@router_db_query.get(RequestUrl.DB_QUERY_LIST)
async def query_db(
        query_type: QueryType = QueryType(QueryType.ErpMissing),
        limit: int = Query(10),
        skip: int = Query(0),
):
    log.debug({"url": RequestUrl.DB_QUERY_LIST, "query_type": query_type, "limit": limit, "skip": skip})

    if query_type == QueryType.ErpMissing:
        query = {"weight_erp": {"$exists": False}, "weight_trd": {"$exists": True}}
    elif query_type == QueryType.TrdMissing:
        query = {"weight_erp": {"$exists": True}, "weight_trd": {"$exists": False}}
    elif query_type == QueryType.AreaMismatch:
        query = {"$where": "this.area_erp != this.area_trd"}
    elif query_type == QueryType.DateMismatch:
        query = {"$where": "this.time_erp != this.time_trd"}
    elif query_type == QueryType.WeightMismatch:
        query = {"$where": "this.weight_erp != this.weight_trd"}
    else:
        raise Exception(ErrorType.QueryParamsError)

    cursor = db[COLL_DETAIL_NAME].find(query, limit=limit, skip=skip)
    return {
        "status": ResponseStatus.OK,
        "data": list(cursor)
    }


@router_db_query.post(RequestUrl.DB_QUERY_LIST)
async def query_db_post(
        query: dict = Body(...),
        limit: int = Query(10),
        skip: int = Query(0),
):
    log.debug({"url": RequestUrl.DB_QUERY_LIST, "query": query, "limit": limit, "skip": skip})

    if not isinstance(query, dict):
        raise Exception(ErrorType.QueryParamsError)
    cursor = db[COLL_DETAIL_NAME].find(query, limit=limit, skip=skip)
    return {
        "status": ResponseStatus.OK,
        "data": list(cursor)
    }
