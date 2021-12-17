# ----------------------------------------
# import path
# ----------------------------------------
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def read_trd():
    import re
    import pandas as pd

    fp = '/Users/mark/Documents/mark_projects/HJXH/hjxh_express_match/data/2021-11/trd/trd_2021-11_曹县中通.xlsx'
    wb = pd.ExcelFile(fp)
    for sn in wb.sheet_names:
        if re.match("_明细", sn):
            return pd.read_excel(fp, sheet_name=sn)
    raise Exception("not found sheet")


def read_erp():
    import pandas as pd

    fp = '/Users/mark/Documents/mark_projects/HJXH/hjxh_express_match/data/2021-11/erp/erp_11月旺店通数据1.csv'
    df = pd.read_csv(fp)


def print_group(x):
    print(x)
    return "-"

def reg(s):
    s.str.replace(r'^.*?((?P<m1>\d\d).(?P<d1>\d\d).(?P<y1>\d{4})|(?P<y2>\d{4}).(?P<m2>\d\d).(?P<d2>\d\d)).*$', lambda  x: x.groups(), regex=True)
