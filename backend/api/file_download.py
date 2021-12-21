import os

from fastapi import APIRouter
from starlette.responses import FileResponse

from const import RequestUrl, ErrorType, SERVER_FILES_DIR, ResponseStatus
from utils import _get_df_file_path, _get_file_path

router_download_file = APIRouter()



@router_download_file.get(RequestUrl.DOWNLOAD_DF)
async def download_df(file_name: str):
    if not os.path.exists(f := _get_df_file_path(file_name)):
        raise Exception(ErrorType.FileNotExisted)
    return FileResponse(f)


@router_download_file.get(RequestUrl.DOWNLOAD_SOURCE)
async def download_source(file_name: str):
    if not os.path.exists(f := _get_file_path(file_name)):
        raise Exception(ErrorType.FileNotExisted)
    return FileResponse(f)
