from typing import Dict
from calc_price.calc_price import ExpressCompany, PROVINCE_LIST, CalcPriceResult, calc_price
from base import ErrorType


def match_express_company(s: str) -> ExpressCompany:
    if ExpressCompany.YunDa in s:
        return ExpressCompany.YunDa
    else:
        raise Exception(f"暂不支持此公司：{s}")


def match_province(s: str) -> str:
    province_prefix = s[:2]
    for target_province in PROVINCE_LIST:
        if province_prefix in target_province:
            return target_province
    else:
        print(f"不能确定`{s}`中的`{province_prefix}`属于哪个省份：{PROVINCE_LIST}")
        raise Exception(ErrorType.ProvinceNotInList)


def calc_price_of_item(item: dict) -> CalcPriceResult:
    express_company = match_express_company(item["物流公司"])
    province = match_province(item["收货地区"])
    return calc_price(express_company, province, item["实际重量"])


if __name__ == "__main__":
    from db import db
    coll = db["2021-11"]
    item = coll.find_one({})
    print(calc_price_of_item(item))
