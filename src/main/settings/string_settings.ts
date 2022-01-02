export const MsgParseFileFinished = 'MsgParseFileFinished';
export const MsgSaveDbFinished = 'MsgSaveDbFinished';
export const MsgParseHeaderError = 'MsgParseHeaderError';

export const stringSettings = {
  [MsgParseFileFinished]: '文件读取完成！',
  [MsgSaveDbFinished]: '数据库存储完成！',
  [MsgParseHeaderError]:
    '由于文件格式不规范导致无法解析，请在wps/excel中另存为.csv格式，然后尝试重新上传。\n如果仍无法解决，请反馈！',
};

export type StringKeys = keyof typeof stringSettings;
