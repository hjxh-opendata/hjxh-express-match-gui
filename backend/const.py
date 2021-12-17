from enum import Enum

# 可用于标识文件、数据库
ALLOWED_FILE_STANDS = ["erp", "trd"]

#
ALLOWED_CSV_ENCODING = ["UTF_8", "GBK"]

# trd表中用以标识明细表表名的正则形式
TARGET_SHEET_NAME_PATTERN = r"^_明细.*$"

# 允许读取的文件类型，包括erp和trd
ALLOWED_FILE_TYPES = [".csv", ".xlsx", ".xls"]

# ERP列名匹配
ERP_COLUMN_MAP = {
    "物流单号": "_id",
    "发货时间": "time",
    "实际重量": "weight",
    "收货地区": "area",
    "物流公司": "logistics",
}

# TRD列名匹配，基于Fallback智能识别
TRD_COLUMN_FALLBACK_MAP = {
    "_id": ("快递单号", "运单编号", "运单号", "运单", "单号"),
    "logistics": ("_快递", ),
    "area": ("省份", "省", "目的", "收货", "到达"),
    "weight": ("重量", ),
    "fee": ("运费", "快递费", "面单费", "费用", "总价",  "金额", "价格",),
    # TODO: 时间列需要在文档中规定一下
    "time": ("发货时间", "发货日期", "时间", "日期")
}

PROVINCE_LIST = [
    "湖南",
    "安徽",
    "浙江",
    "广东",
    "湖北",
    "江西",
    "上海",
    "江苏",
    "北京",
    "河北",
    "河南",
    "天津",
    "福建",
    "山东",
    "广西",
    "山西",
    "贵州",
    "四川",
    "重庆",
    "云南",
    "海南",

    "陕西",
    "黑龙江",
    "吉林",
    "辽宁",

    "甘肃",
    "宁夏",
    "内蒙古",

    "青海",
    "新疆",
    "西藏"
]
PROVINCE_CHARS = "".join(set("".join(PROVINCE_LIST)))


class ErrorType(str, Enum):
    # 上传的文件名不符合硬性格式规定（目前：以trd_或erp_作为前缀）
    FileNameInvalid = "FileNameInvalid"

    # 上传文件不符合${ALLOWED_FILE_TYPES}约束
    FileTypeInvalid = "FileTypeInvalid"

    # 上传文件的编码有误
    FileEncodingInvalid = "FileEncodingInvalid"

    # 上传的Excel表中没有包含目标表${TARGET_SHEET_NAME_PATTERN}
    TargetSheetMissing = "TargetSheetMissing"

    #
    ValidationFailed = "ValidationFailed"

    # trd表中有未匹配成功的列
    TrdColumnMismatch = "TrdColumnMismatch"

    # 日期解析错误
    DateParseError = "DateParseError"

    # 省份解析错误
    ProvinceParseError = "ProvinceParseError"
