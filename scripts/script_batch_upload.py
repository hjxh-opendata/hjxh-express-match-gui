import requests
import os

url = "http://localhost:8000/upload/files/trd"

trd_dir = '/Users/mark/Documents/mark_projects/HJXH/hjxh_express_match/data/2021-11/trd'
trd_file_names = [i for i in os.listdir(trd_dir) if not i.startswith(".")]
trd_file_paths = [os.path.join(trd_dir, i) for i in trd_file_names]
fs = [{"name": i, "path": j}
      for (i, j) in zip(trd_file_names, trd_file_paths)]
fs = sorted(fs, key=lambda x: os.stat(x["path"]).st_size)


# refer: https://stackoverflow.com/a/26639822/9422455
res = requests.post(
    url=url,
    # params={"year_month": "2021-11"},   # 如果没有year_month的话，表里需要有发货时间！
    files=[("files", (f["name"], open(f["path"], "rb"))) for f in fs][:]
)

print(res.json())
