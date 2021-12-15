from enum import Enum
from typing import Any, Optional
from pydantic import BaseModel


class Status(str, Enum):
    """[Status类用于结构化FastAPI的接口]

    Args:
        str ([type]): [description]
        Enum ([type]): [description]
    """
    OK = "ok"
    ERROR = "error"


class ErrorType(str, Enum):
    # --- ERP Errors ---
    # eg. (="432188818204088", "杭州市 拱墅区 泰嘉园B座407")
    ProvinceNotInList = "收货地区的省份不合法"
    WeightInErpInvalid = "ERP中重量不合法"

    # --- TRD Errors ---
    WeightNotMatch = "重量不匹配"
    ProvinceNotMatch = "省份不匹配"
    PriceNotMatch = "价格不匹配"
    ErpIdNotFound = "Erp中不存在此第三方ID"


class ResponseItemModel(BaseModel):
    status: Status
    msg: Optional[str]
    data: Optional[Any]
