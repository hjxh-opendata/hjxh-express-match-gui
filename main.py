from typing import List, Optional

from fastapi import FastAPI
from fastapi.datastructures import UploadFile
from fastapi.param_functions import File, Query

from base import ResponseItemModel, Status
from config import TARGET_TRD_SHEET_NAME, TEMPLATE_UPLOAD_FILES
from upload_file.upload_trd import upload_trd
from utils import load_template_file
from upload_file.upload_erp import upload_erp


app = FastAPI()


@app.get("/")
async def get_home():
    return {"hello": "world"}


@app.post("/upload/files/erp")
async def upload_files(
    files: List[UploadFile] = File(...),
    year_month: Optional[str] = Query(
        None, regex="^\d{4}-\d{2}$", examples=load_template_file(TEMPLATE_UPLOAD_FILES))
) -> ResponseItemModel:
    items = [await upload_erp(file, year_month) for file in files]
    return {
        "stauts": Status.OK,
        "msg": items
    }


@app.post("/upload/files/trd")
async def upload_files(
    files: List[UploadFile] = File(...),
    sheet_name: str = Query(..., description="包含发货单详情的表名",
                            example=TARGET_TRD_SHEET_NAME),
    year_month: Optional[str] = Query(
        None, regex="^\d{4}-\d{2}$", examples=load_template_file(TEMPLATE_UPLOAD_FILES))
) -> ResponseItemModel:
    items = [await upload_trd(file, sheet_name, year_month) for file in files]
    return {
        "stauts": Status.OK,
        "msg": items
    }


if __name__ == "__main__":
    import uvicorn

    RELOAD = False
    uvicorn.run("main:app", host="localhost", port=8000, reload=RELOAD)
