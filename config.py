import os

WORKER_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(WORKER_DIR, "templates")

TEMPLATE_UPLOAD_FILES = "examples_upload_files.json"


DATABASE_NAME = "hjxh_express_match"

# --- ERP ---
# 这里用.xx而非xx是因为后续调用`os.path.splitext()`接口返回时会有`.`
UPLOAD_ERP_FILETYPES_ALLOWED = [".csv"]

# 常州韵达3 没有'原始子订单号'
UPLOAD_ERP_COLUMNS = ['订单编号', '原始单号', '子单原始单号', '仓库',
                          '店铺', '收货地区', '收货地址', '物流公司', '实际重量', '物流单号', '发货时间']
TARGET_ERP_ID_KEY = "物流单号"
DEFAULT_ERP_GUESS_KEYWORD = "物流单号"
TARGET_ERP_SHIPTIME_KEY = "发货时间"    
COLL_ERP_PREFIX = "ERP_"

GUESS_ERP_ENCODING_ALLOWED = ["utf_8", "gbk"]

# --- TRD ---
TARGET_TRD_SHEET_NAME = "订单明细wms"
UPLOAD_TRD_FILETYPES_ALLOWED = ['.xlsx']
UPLOAD_TRD_COLUMNS = ['发货订单号', '快递公司', '快递单号', '所属快递',
                          '省份', '订单商品总数', '订单商品种类数', '账单重量', '发货时间', '快递费', '涨价金额']
TARGET_TRD_ID_KEY = "快递单号"   
TARGET_TRD_SHIPTIME_KEY = "发货时间"    
COLL_TRD_PREFIX = "TRD_"                   
