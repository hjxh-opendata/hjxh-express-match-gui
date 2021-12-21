import os.path

from starlette.testclient import TestClient

from const import RequestUrl, ResponseStatus, ErrorType
from main_diy import app

client = TestClient(app)

SAMPLE_FILE_PATH = '/Users/mark/Documents/mark_projects/皇家小虎/HJXH/hjxh_express_match/data/2021-11/trd/trd_2021-11-沈阳圆通.xlsx'
SAMPLE_FILE_NAME = os.path.basename(SAMPLE_FILE_PATH)


class TestBasic:
    def test_home(self):
        try:
            res = client.get('/')
        except Exception as e:
            print({"error": e.args})
        else:
            print({"code": res.status_code, "text": res.text})

    def test_check_file_exists(self):
        res = client.get(RequestUrl.CHECK_FILE_EXISTS, params={"file_name": "xxx"})
        assert res.text == "false"

        res = client.get(RequestUrl.CHECK_FILE_EXISTS, params={"file_name": SAMPLE_FILE_NAME})
        assert res.text == "true"

    def test_check_file_basic(self):
        # test a file exists without `force_write`
        try:
            client.post(
                RequestUrl.CHECK_FILE_INFO,
                files={"file": open(SAMPLE_FILE_PATH, "rb")},
            )
        except Exception as e:
            assert e.args[0] == ErrorType.FileHasExisted

        # test a file exists with force_write
        res = client.post(
            RequestUrl.CHECK_FILE_INFO,
            files={"file": open(SAMPLE_FILE_PATH, "rb")},
            params={"force_write": True}
        )
        assert res.status_code == 200
        assert res.json()["status"] == ResponseStatus.OK
        assert res.json()["data"]["file_name"] == SAMPLE_FILE_NAME, res.json()


class TestParse:
    def test_parse_df(self):
        try:
            client.get(RequestUrl.PARSE_DF,
                       params={"file_name": SAMPLE_FILE_NAME})
        except Exception as e:
            assert e.args[0] == ErrorType.FileNotExistedInMem

    def test_read_file2df(self):
        # test file not exist
        try:
            client.get(RequestUrl.CONVERT_FILE2DF,
                       params={"file_name": "xxx"})
        except Exception as e:
            assert e.args[0] == ErrorType.FileNotExisted

        # test file existed
        res = client.get(RequestUrl.CONVERT_FILE2DF,
                         params={"file_name": SAMPLE_FILE_NAME})
        print(res.json())
        assert res.json()["status"] == ResponseStatus.OK
        assert res.json()["data"]["df_shape"] == [71218, 29]
        assert res.json()["data"]["dfs_count"] == 1

    def test_parse_df2(self):
        res = client.get(RequestUrl.PARSE_DF,
                         params={"file_name": SAMPLE_FILE_NAME})
        assert res.json()["status"] == ResponseStatus.OK
        print(res.json())


class TestDB:
    def test_update_into_db(self):
        # test df file not exist
        try:
            client.get(RequestUrl.PUSH_DB, params={"file_name": "xxx"})
        except Exception as e:
            assert e.args[0] == ErrorType.FileNotExisted

        # test df files exist
        res = client.get(RequestUrl.PUSH_DB, params={"file_name": SAMPLE_FILE_NAME})
        assert res.json()["status"] == ResponseStatus.OK
        print(res.json())


def test_download_source():
    fn = "trd_2021-11_圆通.xlsx"
    res = client.get(RequestUrl.DOWNLOAD_SOURCE, params={"file_name": fn})
    print(res.headers)
    assert res.status_code == 200
    with open(fn, 'wb') as f:
        f.write(res.content)
    print(res.status_code)
