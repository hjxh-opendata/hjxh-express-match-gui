export const msgFinished = 'msgFinished';

export const msgParsingFileFinished = 'MsgParseFileFinished';
export const msgStoringIntoDbFinished = 'MsgSaveDbFinished';
export const msgParseHeaderError = 'MsgParseHeaderError';
export const msgDatabaseNotEnabled = 'MsgDatabaseNotEnabled';

export const stringSettings = {
  [msgFinished]: '已完成！',
  [msgParsingFileFinished]: '文件读取完成！',
  [msgStoringIntoDbFinished]: '数据库存储完成！',
  [msgParseHeaderError]:
    '由于文件格式不规范导致无法解析，请在wps/excel中另存为.csv格式，然后尝试重新上传。\n如果仍无法解决，请反馈！',
  [msgDatabaseNotEnabled]: 'Database not enabled',
};

export type StringKeys = keyof typeof stringSettings;
