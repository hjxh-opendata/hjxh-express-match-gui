import pymongo

from backend.config import MONGO_URI, MONGO_DB_NAME

uri = pymongo.MongoClient(MONGO_URI)

db = uri[MONGO_DB_NAME]
