# business problems

[toc]

## :white_check_mark: ERP表中，计算价格错误

目前已发现的主要有两种错误：

1. 收货地区填写不规范（6/50+w），导致未能正确识别省份名称，例如：
   <img width="480" alt="picture 1" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1639525460152-97579f7fe2ca3a38b79dbe31af8d7d443f6bb2e389770af37b7cbfcb930e6c4a.png" />

    更新：对于这种问题，直接提示报错即可。

2. 重量为0（这个还比较多，146/50+w），无法理解,例如：
   <img width="480"  alt="picture 4" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1639526551331-6afaff748574f058027b17e33888123b28141b9574b5c35784c49ed5ae093697.png" />

更新：对于这个问题，一开始是某张表给的问题，后续小范围问题可以直接报错提示。

## :white_check_mark: 第三方表匹配不上ERP表

更新：初期是因为发现有很多表的id导出是`=`开头的，后期加了稳健的检测与转换，这个问题就基本没了。

## :white_check_mark: 第三方报表格式

注意到发来的第三方对账单，例如："11月第三方仓韵达"是Excel格式，且包含着"订单明细wms"表与"快递核算标准"表，请问这个应该属于"惯例"吧？ anyway，这个倒不是啥问题哈，个人可以接受。

更新：这个问题其实不重要，因为有一个专门的快递核算大表，可以根据那个进行运费计算。

## :white_check_mark: 第三方表字段含义

<img width="480" alt="picture 5" src="/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/.imgs/1639527863226-37f709795842582ded91cf80e8799c28e39db020bf2712c395ae8fb9e397cb78.png" />  

1. 发货订单号 和 快递单号 之间的区别？该选用哪个？
2. 涨价金额 是不是无关紧要？

更新：目前直接规定死字段。
