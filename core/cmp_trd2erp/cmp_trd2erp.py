from db import db
from base import ErrorType
from config import COLL_TRD_PREFIX, COLL_ERP_PREFIX


year_month = "2021-11"


def cmp_trd2erp(year_month):
    coll_trd = db[COLL_ERP_PREFIX + year_month]
    coll_erp = db[COLL_TRD_PREFIX + year_month]
    for trd_item in coll_trd.find({}):
        trd_id = trd_item["_id"]
        print(f"matching trd id: {trd_id}")

        erp_item = coll_erp.find_one({"_id": trd_id})

        if erp_item is None:
            raise Exception(ErrorType.ErpIdNotFound)

        print(f"found erp: {erp_item}")
