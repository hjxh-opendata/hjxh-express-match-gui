from typing import List
import requests
import os
import re

url = "http://localhost:8000/upload/files/trd"

# 支持正则，否则就等于普通正则搜索
INCLUDED_PATTERNS = [
    # '常州极兔',
    # '漯河极兔'
    # '曹县中通'
]
EXCLUDED_PATTERNS = [
    # '常州极兔',
    # '漯河极兔',
    # '曹县中通'
]
ENABLE_UPDATE = True    # 更新数据库


def filter_files(file_names: List[str], included_patterns: List[str] = None, excluded_patterns: List[str] = None) -> List[str]:
    # filter in included
    if included_patterns is not None and len(included_patterns) > 0:
        temp = []
        for included_pattern in included_patterns:
            f = list(filter(lambda x: re.search(
                included_pattern, x), file_names))
            assert f.__len__(
            ) == 1, f"{included_pattern} not equal 1: {f}"
            temp.append(f[0])
            print(f"include: {f[0]}")
        file_names = temp
    # print(f"filter in, cur file names: {file_names}")

    # filter out excluded
    if excluded_patterns is not None and len(excluded_patterns) > 0:
        for excluded_pattern in excluded_patterns:
            print(f"excluding pattern: {excluded_pattern}")
            for file_name in file_names:
                if re.search(excluded_pattern, file_name):
                    file_names.remove(file_name)
                    print(f"exclude: {file_name}")
                    break
    # print(f"filter out, cur file names: {file_names}")
    return file_names


trd_dir = '/data/2021-11/trd'
trd_file_names = [i for i in os.listdir(trd_dir) if not i.startswith(".")]
trd_file_names = filter_files(
    trd_file_names, INCLUDED_PATTERNS, EXCLUDED_PATTERNS)
print(f"target files: {trd_file_names}")
trd_file_paths = [os.path.join(trd_dir, i) for i in trd_file_names]
fs = [{"name": i, "path": j}
      for (i, j) in zip(trd_file_names, trd_file_paths)]
fs = sorted(fs, key=lambda x: os.stat(x["path"]).st_size)


if not ENABLE_UPDATE:
    print("the update is disabled")
else:
    print("start updating...")
    res = requests.post(
        url=url,
        # 如果没有year_month的话，表里需要有发货时间，然而并没有
        params={"year_month": "2021-11"},
        # refer: https://stackoverflow.com/a/26639822/9422455
        files=[("files", (f["name"], open(f["path"], "rb"))) for f in fs][:20]
    )
    print("finished updating")
    print(res.json())
