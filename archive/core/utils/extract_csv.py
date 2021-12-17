import io
from typing import Union
from ..packages.xlsx2csv import Xlsx2csv

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


def extract_csv_into_bytes(xlsx_fp: Union[str, io.BytesIO], sheetname_pattern: str = DEFAULT_SHEETNAME_PATTERN) -> io.StringIO:
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


if __name__ == "__main__":
    import pandas as pd

    xlsx_fp = '/Users/mark/Documents/mark_projects/HJXH/hjxh_express_match/data/2021-11/trd/trd_2021-11_沈阳极兔.xlsx'
    df = pd.read_csv(extract_csv_into_bytes(xlsx_fp))

    print(df.shape)
