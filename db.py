import pymongo

from config import DATABASE_NAME

uri = pymongo.MongoClient()
db = uri[DATABASE_NAME]
