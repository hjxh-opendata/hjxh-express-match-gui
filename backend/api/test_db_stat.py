from starlette.testclient import TestClient

from const import RequestUrl
from main_diy import app


def test_get_stat_by_date():
    client = TestClient(app)
    res = client.get(RequestUrl.URL_DB_STAT_DATE)
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
    print(res.json())
