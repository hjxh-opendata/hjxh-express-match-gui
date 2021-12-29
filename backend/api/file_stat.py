import os

from fastapi import APIRouter, Query

from const import RequestUrl, ResponseStatus, SERVER_FILES_DIR

router_file_stat = APIRouter()


@router_file_stat.get(RequestUrl.LIST_FILES)
async def list_files(
        with_df: bool = Query(False)
):
    def get_file_info(file_name: str):
        f = os.path.join(SERVER_FILES_DIR, file_name)
        return {
            "file_name": file_name,
            "file_size": os.stat(f).st_size,
            "file_modify_time": os.stat(f).st_mtime,
        }
    return {
        "status": ResponseStatus.OK,
        "data": [get_file_info(fn) for fn in os.listdir(SERVER_FILES_DIR)
                 if (with_df or not fn.endswith("_df.csv"))]
    }