from pprint import pprint
from enum import Enum
import pymongo
import tqdm

uri = pymongo.MongoClient()
db = uri["hjxh_express_match"]

KEY_ERP_PROVINCE = "收货地区"
KEY_ERP_WEIGHT = "实际重量"
KEY_ERP_PRICE = "price"

KEY_TRD_PROVINCE = "省份"
KEY_TRD_WEIGHT = "重量"
KEY_TRD_PRICE = "运费"


class ErrorType(str, Enum):
    # OK
    OK = "OK"

    # ID不存在
    ErpIdNotFound = "Erp中ID不存在"
    TrdIdNotFound = "Trd中ID不存在"

    # 条目不合法
    TrdPriceInvalid = "Trd中价格不合法"
    TrdWeightInvalid = "Trd中重量不合法"
    TrdProvinceInvalid = "Trd中省份不合法"

    ErpPriceInvalid = "Erp中价格不合法"
    ErpWeightInvalid = "Erp中重量不合法"
    ErpProvinceInvalid = "Erp中省份不合法"

    # 条目不匹配
    ErpPriceDismatch = "Erp与Trd中价格不匹配"
    ErpWeightDismatch = "Erp与Trd中重量不匹配"
    ErpProvinceDismatch = "Erp与Trd中省份不匹配"


def cmp_item_Trd2Erp(Erp_item: dict, Trd_item: dict):
    data = {}
    # 重量
    # if Erp_item.get(KEY_ERP_WEIGHT) is None:


def check_id_Trd2Erp(coll_Erp_name: str, coll_Trd_name: str, max_not_found: int = None):
    """检查在Trd中的所有条目，是否能在Erp中找到对应id
    """
    nFound = nNotFound = 0
    sampleIdNotFound = []
    query = {}
    nTotal = db[coll_Trd_name].count_documents(query)
    cursor = db[coll_Trd_name].find(query)
    pbar = tqdm.tqdm(range(nTotal))
    for i in pbar:
        item = cursor.next()
        _id = item["_id"]
        pbar.set_description(f"_id: {_id}, not found: {nNotFound}")
        if db[coll_Erp_name].find_one({"_id": _id}):
            nFound += 1
        else:
            nNotFound += 1
            sampleIdNotFound.append(_id)
            if max_not_found is not None:
                assert max_not_found >= 0, 'max_not found should >= 0'
                if max_not_found == 0:
                    pass
                if nNotFound == max_not_found:
                    break
    return {
        "nTotal": nTotal,
        "nFound": nFound,
        "nNotFound": nNotFound,
        "sampleIdNotFound": sampleIdNotFound,
    }


if __name__ == "__main__":
    COLL_Erp_NAME = "Erp_2021-11"
    COLL_Trd_NAME = "Trd_2021-11"
    pprint(check_id_Trd2Erp(COLL_Erp_NAME, COLL_Trd_NAME))
