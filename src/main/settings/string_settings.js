"use strict";
var _a;
exports.__esModule = true;
exports.stringSettings = exports.MsgParseHeaderError = exports.MsgSaveDbFinished = exports.MsgParseFileFinished = void 0;
exports.MsgParseFileFinished = 'MsgParseFileFinished';
exports.MsgSaveDbFinished = 'MsgSaveDbFinished';
exports.MsgParseHeaderError = 'MsgParseHeaderError';
exports.stringSettings = (_a = {},
    _a[exports.MsgParseFileFinished] = '文件读取完成！',
    _a[exports.MsgSaveDbFinished] = '数据库存储完成！',
    _a[exports.MsgParseHeaderError] = '由于文件格式不规范导致无法解析，请在wps/excel中另存为.csv格式，然后尝试重新上传。\n如果仍无法解决，请反馈！',
    _a);
