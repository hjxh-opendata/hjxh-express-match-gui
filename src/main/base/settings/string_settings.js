"use strict";
var _a;
exports.__esModule = true;
exports.stringSettings = exports.msgDatabaseNotEnabled = exports.msgParseHeaderError = exports.msgStoringIntoDbFinished = exports.msgParsingFileFinished = exports.msgFinished = void 0;
exports.msgFinished = 'msgFinished';
exports.msgParsingFileFinished = 'MsgParseFileFinished';
exports.msgStoringIntoDbFinished = 'MsgSaveDbFinished';
exports.msgParseHeaderError = 'MsgParseHeaderError';
exports.msgDatabaseNotEnabled = 'MsgDatabaseNotEnabled';
exports.stringSettings = (_a = {},
    _a[exports.msgFinished] = '已完成！',
    _a[exports.msgParsingFileFinished] = '文件读取完成！',
    _a[exports.msgStoringIntoDbFinished] = '数据库存储完成！',
    _a[exports.msgParseHeaderError] = '由于文件格式不规范导致无法解析，请在wps/excel中另存为.csv格式，然后尝试重新上传。\n如果仍无法解决，请反馈！',
    _a[exports.msgDatabaseNotEnabled] = 'Database not enabled',
    _a);
