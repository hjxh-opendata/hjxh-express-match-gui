import pymongo

from config import MONGO_URI, MONGO_DB_NAME, MONGO_AUTH_DB_NAME, MONGO_USERNAME, MONGO_PASSWORD

uri = pymongo.MongoClient(
    MONGO_URI,
    username=MONGO_USERNAME,
    password=MONGO_PASSWORD,
    authSource=MONGO_AUTH_DB_NAME
)

db = uri[MONGO_DB_NAME]
