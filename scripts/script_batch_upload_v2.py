import time
from typing import List
import requests
import os
import re
import pymongo

uri = pymongo.MongoClient()
db = uri['hjxh_express_match']
coll = db["stat"]

url = "http://localhost:8000/upload/files/"

# 支持正则，否则就等于普通正则搜索
INCLUDED_PATTERNS = [
    'trd_2021-11_圆通.xlsx',
    # 'trd_2021-11_曹县中通.xlsx',
    # 'trd_2021-11_荆州中通_无价格表.xlsx',
    'trd_2021-11-沈阳圆通.xlsx'
]
EXCLUDED_PATTERNS = [
    'trd_2022-11_铁岭昌图中通.xlsx'
]
UPDATE_INTO_DB = False
DROP_VIA_DB = False
ENABLE_UPDATE = True  # 更新数据库

TRD_DIR_PATH = '/Users/mark/Documents/mark_projects/皇家小虎/HJXH/hjxh_express_match/data/2021-11/trd'
ERP_DIR_11_PATH = '/Users/mark/Documents/mark_projects/皇家小虎/HJXH/hjxh_express_match/data/2021-11/erp'
ERP_DIR_10_PATH = '/Users/mark/Documents/mark_projects/皇家小虎/HJXH/hjxh_express_match/data/2021-10/erp10月数据'


def filter_files(file_names: List[str], included_patterns: List[str] = None, excluded_patterns: List[str] = None) -> \
        List[str]:
    # filter in included
    if included_patterns is not None and len(included_patterns) > 0:
        temp = []
        for included_pattern in included_patterns:
            f = list(filter(lambda x: re.search(
                included_pattern, x), file_names))
            assert len(f) <= 1, f"{included_pattern} failed: {f}"
            if len(f) == 1:
                temp.append(f[0])
                print(f"include: {f[0]}")
        file_names = temp
    # print(f"filter in, cur file names: {file_names}")

    # filter out excluded
    if excluded_patterns is not None and len(excluded_patterns) > 0:
        for excluded_pattern in excluded_patterns:
            # print(f"excluding pattern: {excluded_pattern}")
            for file_name in file_names:
                if re.search(excluded_pattern, file_name):
                    file_names.remove(file_name)
                    print(f"exclude: {file_name}")
                    break
    # print(f"filter out, cur file names: {file_names}")
    return file_names


def traverse_dir(dir_path: str) -> List[dict]:
    file_names = [i for i in os.listdir(dir_path) if not i.startswith(".")]
    file_names = filter_files(
        file_names, INCLUDED_PATTERNS, EXCLUDED_PATTERNS)
    trd_file_paths = [os.path.join(dir_path, i) for i in file_names]
    fs = [{"name": i, "path": j}
          for (i, j) in zip(file_names, trd_file_paths)]
    fs = sorted(fs, key=lambda x: os.stat(x["path"]).st_size)
    return fs


def filter_via_database(file_name: str) -> bool:
    # 有，就去除
    if coll.find_one({"file_name": file_name}):
        print(f"exclude from db: {file_name} ")
        return False
    return True


fs = traverse_dir(TRD_DIR_PATH) + traverse_dir(ERP_DIR_11_PATH) + traverse_dir(ERP_DIR_10_PATH)
if DROP_VIA_DB:
    fs = list(filter(lambda x: filter_via_database(x["name"]), fs))

print([i['name'] for i in fs])

if not ENABLE_UPDATE:
    print("the update is disabled")
else:
    print("start updating...")
    with requests.post(
            url=url,
            params={"push_db": UPDATE_INTO_DB},
            # refer: https://stackoverflow.com/a/26639822/9422455
            files=[("files", (f["name"], open(f["path"], "rb"))) for f in fs][:20],
            stream=True
    ) as r:
        for item in r.iter_lines():
            print({"item": item, "time": time.time()})

    print("finished updating")
