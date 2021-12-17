import os

WORKER_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CORE_DIR = os.path.join(WORKER_DIR, "core")
TEMPLATE_DIR = os.path.join(CORE_DIR, "templates")

TEMPLATE_UPLOAD_FILES = "examples_upload_files.json"


DATABASE_NAME = "hjxh_express_match"
COLL_MESSAGES = "messages"

# --- ERP ---
# 这里用.xx而非xx是因为后续调用`os.path.splitext()`接口返回时会有`.`
ERP_FILETYPES_ALLOWED = [".csv"]

# 常州韵达3 没有'原始子订单号'
# , '子单原始单号', '收货地址'
ERP_FIXED_COLUMNS = ['订单编号', '原始单号', '仓库',
                     '店铺', '收货地区', '物流公司', '实际重量', '物流单号', '发货时间']
ERP_ID_KEY = "物流单号"
ERP_GUESS_KEYWORD = "物流单号"
ERP_SHIPTIME_KEY = "发货时间"
COLL_ERP_PREFIX = "ERP_"

GUESS_ERP_ENCODING_ALLOWED = ["utf_8", "gbk"]

# --- TRD ---
TRD_SHEETNAME_PATTERN = r"^_明细.*$"
# 支持XLS文件格式，例如”山东中通“，目前放弃对XLS优化，直接用pandas读了
TRD_FILETYPES_ALLOWED = ['.xlsx', '.xls']
TRD_ID_KEY = "快递单号"
TRD_SHIPTIME_KEY = "发货时间"
# 用元祖配置fallback，最后返回时，始终使用第一个作为表列名
TRD_FALLBACK_COLUMNS = [
    ('_快递', ),
    # 快递单号也是_id
    (TRD_ID_KEY, '运单编号', '运单号', '运单', '单号',),
    # 常州顺丰直接把省、市、区分开列了，所以这里也要单独加个省字
    ('省份', '省', '目的', '收货', '到达'),
    ('重量',),
    # ”金额“有点危险啊，比如”东莞极兔“就不行
    ('运费', '快递费', '面单费', '费用', '总价', '价格', '金额')
]
TRD_FALLBACK_COLUMNS_WITH_SHIPMENT = TRD_FALLBACK_COLUMNS + [
    (TRD_SHIPTIME_KEY, "发货日期",  "时间", "日期",)
]

COLL_TRD_PREFIX = "TRD_"
