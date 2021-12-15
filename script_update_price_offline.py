from db import db
from calc_price.calc_price_of_item import calc_price_of_item
from base import ErrorType
from tqdm import tqdm

# TODO: 这个脚本只是用于离线更新计算价格正常的条目，还不能确定计算的是否正确，以及未能计算价格的条目如何处理

coll = db["2021-11"]

# 每一趟必产生价格或者错误，若价格不存在且错误不存在，则属于待更新目标
query = {"$and": [{"price": {"$exists": False}},
                  {"error_type": {"$exists": False}}]}
total = coll.count_documents(query)
cursor = coll.find(query)
pbar = tqdm(range(total))
for i in pbar:
    item = cursor.next()
    _id = item["_id"]
    pbar.set_description(f"processing _id: {_id}")
    try:
        result = calc_price_of_item(item)
    except Exception as e:
        if isinstance(e.args[0], ErrorType):
            coll.update_one({"_id": _id}, {"$set": {"error_type": e.args[0]}})
        else:
            raise e
    else:
        coll.update_one({"_id": _id}, {"$set": result})
