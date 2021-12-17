from path import *

from core.db.conn import db


for coll in db.list_collection_names():
    if coll != "ERP_2021-11":
        db.drop_collection(coll)

        print("dropped coll of: " + coll)
