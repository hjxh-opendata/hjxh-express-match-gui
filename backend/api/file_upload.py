import os
import re
import time
from datetime import datetime, timedelta
from typing import Dict, List

import aiofiles
import pandas as pd
from fastapi import APIRouter, Query, UploadFile, File
from pandas import DataFrame

from const import RequestUrl, ALLOWED_FILE_STANDS, ErrorType, ALLOWED_FILE_TYPES, ResponseModel, SERVER_MAX_CLIENTS, \
    ALLOWED_CSV_ENCODING, TARGET_SHEET_NAME_PATTERN, ResponseStatus, ERP_COLUMN_MAP, TRD_COLUMN_FALLBACK_MAP, \
    PROVINCE_CHARS, PROVINCE_LIST
from log import log
from utils import _get_file_path, _get_df_file_path, _try_to_get_file_stand

router_upload_file = APIRouter()

dfs: Dict[str, DataFrame] = {}


# ----------------------------------------
# 文件上传
# ----------------------------------------

@router_upload_file.get(RequestUrl.CHECK_FILE_EXISTS, response_model=bool)
async def check_file_exists(file_name: str) -> bool:
    return os.path.exists(_get_file_path(file_name))


@router_upload_file.post(RequestUrl.CHECK_FILE_INFO)
async def check_file_basic(
        file: UploadFile = File(...),
        force_write: bool = Query(False,
                                  description="if not specify `force_write`, then would cause error when file existed otherwise ok")
):
    print(f"processing file of name: " + file.filename)

    # ----------------------------------------
    # check file name and type
    # ----------------------------------------
    file_stand = file.filename.split("_")[0]
    if file_stand not in ALLOWED_FILE_STANDS:
        raise Exception(ErrorType.FileNameInvalid,
                        {"file_stand": file_stand, "allowed_file_stand": ALLOWED_FILE_STANDS})
    file_type = os.path.splitext(file.filename)[1]
    if file_type not in ALLOWED_FILE_TYPES:
        raise Exception(ErrorType.FileTypeInvalid, {"file_type": file_type, "allowed_file_type": ALLOWED_FILE_TYPES})

    # ----------------------------------------
    # check local file exist
    # ----------------------------------------
    if not force_write and os.path.exists(_get_file_path(file.filename)):
        raise Exception(ErrorType.FileHasExisted, {"file_name": file.filename})

    s_time = time.time()
    async with aiofiles.open(_get_file_path(file.filename), "wb") as out_file:
        while content := await file.read(1024):
            await out_file.write(content)

    file_size = file.__sizeof__()
    return {
        "status": "ok",
        "data": {
            "file_name": file.filename,
            "file_stand": file_stand,
            "file_type": file_type,
            "file_size": file_size,
            "read_time": time.time() - s_time
        }
    }


@router_upload_file.get(RequestUrl.CONVERT_FILE2DF, response_model=ResponseModel)
async def read_file2df(file_name: str):
    file_type = os.path.splitext(file_name)[-1]
    file_path = _get_file_path(file_name)
    if not await check_file_exists(file_name):
        raise Exception(ErrorType.FileNotExisted, {"file_name": file_name})

    if len(dfs) >= SERVER_MAX_CLIENTS:
        raise Exception(ErrorType.ServerCapacityLimit, "请稍后再试")

    if file_type == ".csv":
        for possible_encoding in ALLOWED_CSV_ENCODING:
            try:
                df = pd.read_csv(file_path, encoding=possible_encoding)
            except Exception:
                pass
            else:
                break
        else:
            raise Exception(ErrorType.FileEncodingInvalid, {"filed attempts": ALLOWED_CSV_ENCODING})
    elif file_type in [".xlsx", ".xls"]:
        wb = pd.ExcelFile(file_path)
        log.debug({"sheet_names": wb.sheet_names})
        for sn in wb.sheet_names:
            if re.match(TARGET_SHEET_NAME_PATTERN, sn):
                log.debug({"found target sheet": sn})
                df = pd.read_excel(file_path, sheet_name=sn)
                break
        else:
            log.warning("not found target sheet")
            raise Exception(ErrorType.TargetSheetMissing)
    else:
        raise Exception(ErrorType.FileTypeInvalid)

    # add df into global dfs
    dfs[file_name] = df
    log.debug(f"finished read file {file_name}, shape: {df.shape}")
    log.debug(f"added df into global dfs, len(dfs) == {len(dfs)}")
    return {
        "status": ResponseStatus.OK,
        "data": {
            "df_shape": df.shape,
            "dfs_count": len(dfs)
        }
    }


@router_upload_file.get(RequestUrl.PARSE_DF, response_model=ResponseModel)
async def parse_df(file_name: str):
    if file_name not in dfs:
        raise Exception(ErrorType.FileNotExistedInMem, {"file_name": file_name, "dfs_names": dfs.keys()})

    df = dfs[file_name]
    pack = {"rows": []}

    def record_rows(df):
        pack["rows"].append(len(df))

    file_stand = _try_to_get_file_stand(file_name)

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
    record_rows(df)
    log.debug(f"rows_1_initial: {len(df)}")

    df.dropna(subset=["_id"], inplace=True)
    record_rows(df)
    log.debug(f"rows_2_dropna_id: {len(df)}")

    ### 3. 删除重复ID列
    df.drop_duplicates(subset=["_id"], inplace=True)
    log.debug(f"rows_3_drop_duplicated_id: {len(df)}")
    record_rows(df)

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
    record_rows(df)

    # ----------------------------------------
    # [validation]
    # ----------------------------------------

    # 1. 重量应为正数
    df.query("weight > 0", inplace=True)
    log.debug(f"rows_5_drop_weight_invalid: {len(df)}")
    record_rows(df)

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
    record_rows(df)

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
    record_rows(df)

    # 5. 如果有价格的话，对价格也做核验【erp的价格在后续比对的时候再更新】
    if "fee" in df.columns:
        if df.fee.dtype != float:
            df.fee = df.fee.str.replace(r'^.*?(\d+\.\d+|\d+).*$', r'\1', regex=True).astype(float)
        df.query("fee > 0", inplace=True)
        log.debug(f"rows_8_drop_fee_invalid: {len(df)}")
    # 尽管erp没有fee，这里为了通用，依旧补上
    record_rows(df)

    ### 6. 判空
    if len(df) == 0:
        raise Exception(ErrorType.NoUsefulData)

    ### 7. 存储
    df.to_csv(_get_df_file_path(file_name), encoding="utf_8_sig")
    dfs.pop(file_name)  # 移除文件，防止占据越来越多的内存

    return {
        "status": ResponseStatus.OK,
        "data": pack
    }
