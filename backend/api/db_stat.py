from typing import List, Dict

from fastapi import APIRouter, Query

from const import ErrorType, ResponseModel, ResponseStatus, RequestUrl
from db import db
from config import COLL_DETAIL_NAME

router_db_stat = APIRouter()

# only for test
TEST_ENABLED = False
TEST_LIMIT = 100000

_queries = []
if TEST_ENABLED:
    _queries: List[Dict] = [{"$limit": TEST_LIMIT}]


@router_db_stat.get(RequestUrl.URL_DB_STAT_DATE, response_model=ResponseModel)
def get_stat_by_date(
        from_erp: bool = Query(True, description="true -> 按erp统计；false -> 按trd统计"),
        sort_by_id: bool = Query(True, description="true -> 按日期增序排序"),
        sort_by_cnt: bool = Query(False, description="true -> 按数量减序排序")
):
    assert not (sort_by_id and sort_by_cnt), ErrorType.QueryParamsError
    queries = _queries + [
        {"$group": {"_id": "$time_erp" if from_erp else "$time_trd", "cnt": {"$sum": 1}}}
    ]
    if sort_by_id:
        queries.append({"$sort": {"_id": 1}})
    if sort_by_cnt:
        queries.append({"$sort": {"cnt": -1}})
    return {
        "status": ResponseStatus.OK,
        "data": list(db[COLL_DETAIL_NAME].aggregate(queries))
    }


@router_db_stat.get(RequestUrl.URL_DB_STAT_AREA, response_model=ResponseModel)
def get_stat_by_area(
        from_erp: bool = Query(True, description="true -> 按erp统计；false -> 按trd统计"),
        sort_by_cnt: bool = Query(True, description="true -> 按数量减序排序")
):
    queries = _queries + [
        {"$group": {"_id": "$area_erp" if from_erp else "$area_trd", "cnt": {"$sum": 1}}}
    ]
    if sort_by_cnt:
        queries.append({"$sort": {"cnt": -1}})
    return {
        "status": ResponseStatus.OK,
        "data": list(db[COLL_DETAIL_NAME].aggregate(queries))
    }


@router_db_stat.get(RequestUrl.URL_DB_STAT_LOGISTICS, response_model=ResponseModel)
def get_stat_by_area(
        from_erp: bool = Query(True, description="true -> 按erp统计；false -> 按trd统计"),
        sort_by_cnt: bool = Query(True, description="true -> 按数量减序排序")
):
    queries = _queries + [
        {"$group": {"_id": "$logistics_erp" if from_erp else "$logistics_trd", "cnt": {"$sum": 1}}}
    ]
    if sort_by_cnt:
        queries.append({"$sort": {"cnt": -1}})
    return {
        "status": ResponseStatus.OK,
        "data": list(db[COLL_DETAIL_NAME].aggregate(queries))
    }
