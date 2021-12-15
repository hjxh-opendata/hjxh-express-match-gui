from typing import List, Optional

from fastapi import FastAPI
from fastapi.datastructures import UploadFile
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html, get_swagger_ui_oauth2_redirect_html, get_redoc_html
from fastapi.param_functions import File, Query
from fastapi.staticfiles import StaticFiles

from core.base import ResponseItemModel, Status
from core.config import TEMPLATE_UPLOAD_FILES
from core.upload_file.upload_erp import upload_erp
from core.upload_file.upload_trd import upload_trd
from core.utils.general import load_template_file

# docs_url=None，这样就可以用本地的了
app = FastAPI(docs_url=None, redoc_url=None)


app.mount('/static', StaticFiles(directory="static"), name="static")


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )


@app.get(app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()


@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_js_url="/static/redoc.standalone.js",
    )


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
    year_month: Optional[str] = Query(
        None, regex="^\d{4}-\d{2}$", examples=load_template_file(TEMPLATE_UPLOAD_FILES))
) -> ResponseItemModel:
    items = [await upload_trd(file, year_month) for file in files]
    return {
        "stauts": Status.OK,
        "msg": items
    }


if __name__ == "__main__":
    import uvicorn

    RELOAD = False
    uvicorn.run("main:app", host="localhost", port=8000, reload=RELOAD)
