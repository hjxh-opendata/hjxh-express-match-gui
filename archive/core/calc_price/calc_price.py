from enum import Enum
import math
from typing import TypedDict

from base import ErrorType


class ExpressCompany(str, Enum):
    YunDa = "韵达"


# 省份不适合用Enum是因为有拼音是相同的，比如“陕西”和“山西”
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


class CalcPriceResult(TypedDict):
    price: float
    desc: str


def calc_price(express: ExpressCompany, province: str, weight: float) -> CalcPriceResult:
    assert province in PROVINCE_LIST, f"{province}不在省份列表{PROVINCE_LIST}内"
    if weight <= 0:
        print(f"weight {weight} ≯ 0")
        raise Exception(ErrorType.WeightInErpInvalid)

    if express == ExpressCompany.YunDa:
        prices_matrix = [
            # 第五个是超重的基础价，第六个是超重的增价
            [2.5, 2.6, 3.2, 3.3, 4.0, 1.2],
            [3.0, 3.2, 3.4, 3.6, 4.0, 1.5],
            [3.2, 3.3, 3.4, 3.9, 4.5, 1.5],
            [9.0, 9.0, 13.0, 17.0, 17.0, 4.0]
        ]

        # 确定该省在价格矩阵中的第几行
        province_groups = [
            ["湖南", "安徽", "浙江", "广东", "湖北", "江西", "上海", "江苏", "北京", "河北", "河南",
                "天津", "福建", "山东", "广西", "山西", "贵州", "四川", "重庆", "云南", "海南", ],
            ["陕西", "黑龙江", "吉林", "辽宁", ],
            ["甘肃", "宁夏", "内蒙古", ],
            ["青海", "新疆", "西藏"]
        ]
        province_index_dict = dict((k, i) for (
            i, j) in enumerate(province_groups) for k in j)
        province_index = province_index_dict[province]
        province_prices = prices_matrix[province_index]

        # 确定该省在价格矩阵中的第几列，并计算其价格
        weights_group = [0.0, 0.5, 1.0, 2.0, 3.0]
        # 对超重的，使用基准价+超重价
        if weight > weights_group[-1]:
            # TODO: 确认一下，是否是向上保留两位小数
            price = province_prices[-2] + \
                math.ceil(weight - weights_group[-1]) * province_prices[-1]
            # 向上保留两位小数
            price = math.ceil(price * 100) / 100
            desc = f"[weight] {weight:.1f} > {weights_group[-1]:.1f} --> [price] { province_prices[-2]:.2f} + {math.ceil(weight - weights_group[-1])} * {province_prices[-1]:.2f} = {price:.2f}"
        else:
            # 其它的，使用固定区间价格
            for weight_group in range(3, -1, -1):
                if weight > weights_group[weight_group]:
                    price = province_prices[weight_group]
                    desc = f"[weight] {weights_group[weight_group]:.1f} < {weight:.1f} <= {weights_group[weight_group+1]:.1f} --> [price] {price:.2f}"
                    break
        return {
            "price": price,
            "desc": desc
        }

    else:
        # TODO: 完成其他快递计算价格的办法
        raise Exception("该快递暂不支持计算")
