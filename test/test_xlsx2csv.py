from path import *
from my_packages.xlsx2csv import Xlsx2csv
import time

DEFAULT_SHEETNAME_PATTERN = r'^_明细.*$'


def extract_csv_into_file(xlsx_fp: str, filename: str, sheetname_pattern: str = DEFAULT_SHEETNAME_PATTERN):
    x = Xlsx2csv(
        xlsxfile=xlsx_fp,
        include_sheet_pattern=sheetname_pattern,
        outputencoding="utf_8",
        skip_empty_lines=True,
        skip_trailing_columns=True,
    )
    x.convert(filename, sheetid=x.getSheetIdByRegexName(sheetname_pattern))


def extract_csv_into_bytes(xlsx_fp: str, sheetname_pattern: str = DEFAULT_SHEETNAME_PATTERN):
    x = Xlsx2csv(
        xlsxfile=xlsx_fp,
        include_sheet_pattern=sheetname_pattern,
        outputencoding="utf_8",
        skip_empty_lines=True,
        skip_trailing_columns=True,
    )
    # reference: https://stackoverflow.com/a/68552078/9422455
    import io
    buffer = io.StringIO()
    x.convert(buffer, sheetid=x.getSheetIdByRegexName(sheetname_pattern))
    buffer.seek(0)
    return buffer


def extract_csv_into_bytes2(xlsx_fp: str, sheetname: str):
    x = Xlsx2csv(
        xlsxfile=xlsx_fp,
        outputencoding="utf_8",
        skip_empty_lines=True,
        skip_trailing_columns=True,
    )
    # reference: https://stackoverflow.com/a/68552078/9422455
    import io
    buffer = io.StringIO()
    x.convert(buffer, sheetid=x.getSheetIdByName(sheetname))
    buffer.seek(0)
    return buffer


if __name__ == "__main__":
    import pandas as pd
    xlsx_fp = '/Users/mark/Documents/mark_projects/HJXH/hjxh_express_match/data/2021-11/trd/trd_2021-11_常州韵达.xlsx'

    t1_start = time.time()
    pd.read_excel(xlsx_fp, sheet_name="_明细")
    t1_end = time.time()

    # t2_start = time.time()
    # pd.read_excel(xlsx_fp, sheet_name="11月运费账单")
    # t2_end = time.time()

    t3_start = time.time()
    pd.read_csv(extract_csv_into_bytes(xlsx_fp))
    t3_end = time.time()

    # t4_start = time.time()
    # pd.read_csv(extract_csv_into_bytes2(xlsx_fp, "11月运费账单"))
    # t4_end = time.time()

    print({
        "t1": t1_end - t1_start,
        # "t2": t2_end - t2_start,
        "t3": t3_end - t3_start,
        # "t4": t4_end - t4_start
    })
