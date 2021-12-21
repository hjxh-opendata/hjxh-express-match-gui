import os
import platform

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from api.db_query import router_db_query
from api.db_stat import router_db_stat
from api.file_download import router_download_file
from api.db_push import router_push_db
from api.file_stat import router_file_stat
from api.file_upload import router_upload_file
from const import ResponseModel

# TODO: 目前采用直接存储文件的办法，也就是会分两次读取，下次会考虑用全局字典直接在io.Bytes里跨api操作
# root_path 有个问题，当使用自定义doc_url时
if platform.system() == "Darwin":
    app = FastAPI()
else:
    app = FastAPI(root_path="/api/v1", root_path_in_servers=False)

app.include_router(router_upload_file, tags=["文件上传"])
app.include_router(router_download_file, tags=["文件下载"])
app.include_router(router_file_stat, tags=["文件统计"])
app.include_router(router_push_db, tags=["数据库入表"])
app.include_router(router_db_query, tags=["数据库查询"])
app.include_router(router_db_stat, tags=["数据库统计"])

# ----------------------------------------
# CORS
# ----------------------------------------

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://101.43.125.199",
    "http://101.43.125.199:3000"
]

# https://github.com/tiangolo/fastapi/issues/731
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get('/', response_model=ResponseModel)
async def home():
    return {
        "status": "ok",
        "msg": "ok"
    }


if __name__ == "__main__":
    import uvicorn

    RELOAD = False
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=RELOAD)
