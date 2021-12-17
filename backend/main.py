import io
import json
import os
import re
import time
from datetime import datetime, timedelta
from typing import List

import pandas as pd
from fastapi import FastAPI
from fastapi.datastructures import UploadFile
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html, get_swagger_ui_oauth2_redirect_html, \
    get_redoc_html
from fastapi.param_functions import File, Query
from fastapi.staticfiles import StaticFiles

# docs_url=None，这样就可以用本地的了
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse

from backend.config import MONGO_COLL_DETAIL_NAME, MONGO_COLL_STAT_NAME
from backend.const import ErrorType, ALLOWED_FILE_STANDS, TRD_COLUMN_FALLBACK_MAP, ERP_COLUMN_MAP, \
    TARGET_SHEET_NAME_PATTERN, PROVINCE_LIST, PROVINCE_CHARS, ALLOWED_CSV_ENCODING
from backend.db import db
from backend.log import log

app = FastAPI(docs_url=None, redoc_url=None)

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

# https://github.com/tiangolo/fastapi/issues/731
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

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


async def fake_video_streamer():
    for i in range(5):
        print({"i": i, "time": time.time()})
        time.sleep(2)
        yield b"some fake video bytes"


def real_video_streamer():
    with open('/Users/mark/Downloads/sample-mp4-file.mp4', 'rb') as f:
        yield from f


@app.get("/")
async def main():
    return StreamingResponse(real_video_streamer(), media_type="video/mp4")


@app.post("/upload/file")
async def upload_file(
        file: UploadFile = File(...),
        update_into_db: bool = Query(True)
):
    """
    新版就不分erp和trd了，也不分年月日了，直接干！
    :param file:
    :param update_into_db:
    :return:
    """
    pack = {}

    # ----------------------------------------
    # [read] read file into bytes and load into df
    # ----------------------------------------
    log.debug(f"----------------------------\nprocessing file of name: " + file.filename)
    print(f"processing file of name: " + file.filename + ", ", end="")
    pack["file_name"] = file.filename
    pack["file_stand"] = file_stand = file.filename.split("_")[0]
    if file_stand not in ALLOWED_FILE_STANDS:
        print("[error]")
        raise Exception(ErrorType.FileNameInvalid,
                        {"file_stand": file_stand, "allowed_file_stand": ALLOWED_FILE_STANDS})
    file_type = os.path.splitext(file.filename)[1]
    file_bytes = io.BytesIO(file.file.read())
    pack["file_size"] = file_size = file_bytes.__sizeof__()
    print("file size: " + str(file_bytes.__sizeof__()))
    log.debug({"file_type": file_type, "file_size": file_size})
    if file_type == ".csv":
        for possible_encoding in ALLOWED_CSV_ENCODING:
            try:
                df = pd.read_csv(file_bytes, encoding=possible_encoding)
            except Exception:
                file_bytes.seek(0)
            else:
                break
        else:
            raise Exception(ErrorType.FileEncodingInvalid, {"filed attempts": ALLOWED_CSV_ENCODING})
    elif file_type in [".xlsx", ".xls"]:
        wb = pd.ExcelFile(file_bytes)
        log.debug({"sheet_names": wb.sheet_names})
        for sn in wb.sheet_names:
            if re.match(TARGET_SHEET_NAME_PATTERN, sn):
                log.debug({"found target sheet": sn})
                pack["sheet_name"] = sn
                df = pd.read_excel(file_bytes, sheet_name=sn)
                break
        else:
            log.warning("not found target sheet")
            raise Exception(ErrorType.TargetSheetMissing)
    else:
        raise Exception(ErrorType.FileTypeInvalid)
    log.debug(("finished reading file, df shape: ", str(df.shape)))
    print("df shape: " + str(df.shape))
    df_screenshot = df.head()

    # ----------------------------------------
    # [wash] drop unnecessary columns and nan rows
    # ----------------------------------------

    ### 1. 选列
    log.debug({"raw columns": df.columns.tolist()})
    if file_stand == "erp":
        df.rename(columns=ERP_COLUMN_MAP, inplace=True)
        df = df[ERP_COLUMN_MAP.values()]
    else:
        def map_trd_columns(choices: List[str]) -> str:
            for choice in choices:
                for column in df.columns:
                    if choice in column:
                        return column

        temp = {}
        for (target_key, choices) in TRD_COLUMN_FALLBACK_MAP.items():
            target_column = map_trd_columns(choices)
            if not target_column:
                raise Exception(ErrorType.TrdColumnMismatch,
                                {"target_key": target_key, "choices": choices, "columns": df.columns.tolist()})
            temp[target_column] = target_key
        log.debug(f"columns_map: {temp}")
        pack["columns_map"] = temp
        df.rename(columns=temp, inplace=True)
        df = df[temp.values()]
    log.debug("columns selected ")

    ### 2. 删除空ID列
    pack["rows_1_initial"] = len(df)
    log.debug(f"rows_1_initial: {len(df)}")

    df.dropna(subset=["_id"], inplace=True)
    pack["rows_2_dropna_id"] = len(df)
    log.debug(f"rows_2_dropna_id: {len(df)}")

    ### 3. 删除重复ID列
    df.drop_duplicates(subset=["_id"], inplace=True)
    log.debug(f"rows_3_drop_duplicated_id: {len(df)}")
    pack["rows_3_drop_duplicated_id"] = len(df)

    ### 4. 标准化ID
    s = df["_id"]  # pd.Series
    # 抑制由excel引起的浮点数问题
    if s.dtype == float:
        log.debug("_id列是浮点数类型，正在转化为整数")
        # 在没有nan时可以由float --> int
        s = s.astype(int)
    # 转化为标准字符串（只包含数字与字母），抑制由excel引起的"="号问题
    df["_id"] = s.astype(str).str.replace(r'^.*?([A-z0-9]+).*$', r"\1", regex=True)

    ### 5. 删除空行
    df.dropna(inplace=True)
    log.debug(f"rows_4_dropna: {len(df)}")
    pack["rows_4_dropna"] = len(df)

    # ----------------------------------------
    # [validation]
    # ----------------------------------------

    # 1. 重量应为正数
    df.query("weight > 0", inplace=True)
    log.debug(f"rows_5_drop_weight_invalid: {len(df)}")
    pack["rows_5_drop_weight_invalid"] = len(df)

    # 2. 日期应合法
    if df.time.dtype == float:
        # 基于之前研究的算法，有改进空间，但最好当然是让他们不要瞎导表
        df.time = df.time.apply(lambda x: (datetime(1900, 1, 1) + timedelta(days=int(x) - 2)).strftime("%Y-%m-%d"))
    else:
        def capture_ymd(x):
            y = x.group('y1') or x.group('y2')
            m = x.group('m1') or x.group('m2')
            d = x.group('d1') or x.group('d2')
            try:
                assert y is not None and m is not None and d is not None
                y = int(y)
                m = int(m)
                d = int(d)
                assert 2000 < y < 2300
                assert 1 <= m <= 12
                assert 1 <= d <= 31
            except Exception as e:
                log.warning((ErrorType.DateParseError, {"y": y, "m": m, "d": d, "groups": x.groups(), "error": e.args}))
                return None
            # 由于上面已经用int进行转换，导致丢去了可能的十位因此需要补齐
            return f"{y}-{m:02}-{d:02}"

        # 要加上astype(str)将object转成str
        # 先匹配MM.DD.YYYY，再匹配YYYY.MM.DD，防止出现MM.DD.YYYY.HH:MM:SS的出现
        df.time = df.time.astype(str).str.replace(
            r'^.*?((?P<m1>\d\d).(?P<d1>\d\d).(?P<y1>\d{4})|(?P<y2>\d{4}).(?P<m2>\d\d).(?P<d2>\d\d)).*$', capture_ymd,
            regex=True)
    df = df[df.time.notna()]
    log.debug(f"rows_6_drop_date_invalid: {len(df)}")
    pack["rows_6_drop_date_invalid"] = len(df)

    # 3. 省份应合法
    def capture_province(x: str):
        """
        这个函数的核心，就是假设省份肯定在开头，但是可能会有一点点小误差，这个程序允许修复一定的误差，但对于更深程度的误差不做考虑
        :param x:
        :return:
        """
        try:
            assert len(x) >= 2
            N = len(x)
            for i in range(N):
                if x[i] not in PROVINCE_CHARS:
                    continue
                assert i + 1 < N
                if x[i] + x[i + 1] in PROVINCE_LIST:
                    return x[i] + x[i + 1]
                assert i + 2 < N
                if x[i] + x[i + 1] + x[i + 2] in PROVINCE_LIST:
                    return x[i] + x[i + 1] + x[i + 2]
                return None
        except Exception:
            log.warning((ErrorType.ProvinceParseError, {"area": x}))
            return None

    df.area = df.area.apply(capture_province)
    df = df[df.area.notna()]
    log.debug(f"rows_7_drop_province_invalid: {len(df)}")
    pack["rows_7_drop_province_invalid"] = len(df)

    # 5. 如果有价格的话，对价格也做核验【erp的价格在后续比对的时候再更新】
    if "fee" in df.columns:
        if df.fee.dtype != float:
            df.fee = df.fee.str.replace(r'^.*?(\d+\.\d+|\d+).*$', r'\1', regex=True).astype(float)
        df.query("fee > 0", inplace=True)
        log.debug(f"rows_8_drop_fee_invalid: {len(df)}")
        pack["rows_8_drop_fee_invalid"] = len(df)

    ### 6. 判空
    if len(df) == 0:
        log.warning("\n" + df_screenshot.to_string())
        raise Exception(ErrorType.ValidationFailed)

    # ----------------------------------------
    # [store] update into database
    # ----------------------------------------

    if update_into_db:
        ### 1. 加上文件名与日期名
        df["file_name"] = file.filename
        df["update_time"] = datetime.now()

        ### 2. 加上stand后缀
        df.rename(columns=dict((i, i + "_" + file_stand) for i in df.columns if i != "_id"), inplace=True)

        ### 3. 设置index，并插入表
        df.set_index("_id", inplace=True)
        nUpserted = nMatched = nModifed = 0
        for (index, row) in df.iterrows():
            # 在result中，如果没有match就要upsert，如果match了，就要尝试修改，但很有可能数据是相同的，所以就会modified为0
            result = db[MONGO_COLL_DETAIL_NAME].update_one({"_id": index}, {"$set": dict(row)}, upsert=True)
            if result.upserted_id:
                nUpserted += 1
            nMatched += result.matched_count
            nModifed += result.modified_count
        pack["db_record"] = d = {"nUpserted": nUpserted, "nMatched": nMatched, "nModified": nModifed}
        log.debug(d)

        ### 4. 抄送汇总信息倒stat表
        db[MONGO_COLL_STAT_NAME].insert_one({**pack, "update_time": datetime.now()})
        log.debug(f"saved synchronized into coll of {MONGO_COLL_STAT_NAME}")

    return {
        "status": "ok",
        "pack": pack
    }


@app.post("/upload/files")
async def upload_files(
        files: List[UploadFile] = File(...),
        update_into_db: bool = Query(True)
):
    async def parse_files(file):
        return await upload_file(file, update_into_db)

    return [await parse_files(file) for file in files]


if __name__ == "__main__":
    import uvicorn

    RELOAD = False
    uvicorn.run("main:app", host="localhost", port=8000, reload=RELOAD)
