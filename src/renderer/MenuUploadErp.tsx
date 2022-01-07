import React, { useState } from 'react';

import { LogLevel } from '../main/modules/base/response';
import { RequestParseFile } from '../main/modules/parseFile/channels';
import {
  ErrorParsingRow,
  ErrorPreParsingRows,
  errorPreParsingRows,
} from '../main/modules/parseFile/error_types';
import { IContentWithResult } from '../main/modules/parseFile/handler/parse_base';
import { IContentParseFinish } from '../main/modules/parseFile/handler/parse_finish';
import { IContentValidateError } from '../main/modules/parseFile/handler/parse_validate';
import { IReqParseFile } from '../main/modules/parseFile/request';
import { IResParseFile } from '../main/modules/parseFile/response';
import { RequestSelectFile } from '../main/modules/selectFile/channels';
import { IContentSelectFile, IResSelectFile } from '../main/modules/selectFile/response';
import { SET_MAX_CONSOLE_ITEMS, SET_MAX_UPLOAD_HISTORY } from '../main/settings/number_settings';
import { MsgParseFileFinished, MsgSaveDbFinished } from '../main/settings/string_settings';
import { getFileNameFromPath } from '../universal';

import { Console, ConsoleItem, makeItemFromMain, makeItemFromText } from './components/Console';
import { UploadClick } from './components/UploadClick';
import UploadHistory, { IUploadItem } from './components/UploadHistory';

import { getSetting, renderResult } from './utils';

/**
 * todo: [+++] 实现后台持久化log到文件
 * √: 实时在前端console刷新输出具体内容其实不太友好，而且会比较慢，比较合适的方法是在console输出进度条，而在F12里输出具体信息
 * @constructor
 */
export const MenuUploadErp = () => {
  const [consoles, setConsoles] = useState<ConsoleItem[]>([]);
  const [uploaded, setUploaded] = useState<IUploadItem[]>([]);
  const [sizePct, setSizePct] = useState(0);
  const [rowsPct, setRowsPct] = useState(0);

  const pushMsg = (msg: ConsoleItem) => {
    setConsoles((msgs) => [...msgs, msg].slice(-getSetting('number', SET_MAX_CONSOLE_ITEMS)));
  };

  const resetPct = () => {
    setSizePct(0);
    setRowsPct(0);
  };

  const updatePct = (content: IContentWithResult) => {
    setSizePct(Math.min(content.result.parseResult.sizePct * 100, 100));
    setRowsPct(content.result.parseResult.rowsPct * 100);
  };

  const requestSelectFile = () =>
    new Promise<string | null>((resolve) => {
      console.log('selecting file');
      window.electron.request(RequestSelectFile);
      window.electron.once(RequestSelectFile, (m: IResSelectFile) => {
        console.log('received files return: ', m);
        const { filePaths } = m.content;
        if (filePaths.length === 0) return pushMsg(makeItemFromText('cancelled'));
        if (filePaths.length > 1)
          return pushMsg(makeItemFromText('should filePaths.length === 1', LogLevel.error));

        pushMsg(
          makeItemFromMain(
            m,
            (c: IContentSelectFile) => `selected file: ${getFileNameFromPath(c.filePaths[0])}`
          )
        );

        const fp = filePaths[0];
        // check existed
        if (uploaded.some((i) => getFileNameFromPath(fp) === i.fileName))
          return pushMsg(
            makeItemFromText(
              `[UPLOAD DENY]: the file '${getFileNameFromPath(fp)}' has been uploaded!`,
              LogLevel.warn
            )
          );
        return resolve(fp);
      });
    });

  const requestReadFile = (req: IReqParseFile) =>
    new Promise<boolean>(() => {
      pushMsg(makeItemFromText('reading file...')); // for placeholder
      window.electron.request(RequestParseFile, req);
      window.electron.on(RequestParseFile, (res: IResParseFile) => {
        console.log(res);
        if (res.error) {
          if (errorPreParsingRows.includes(res.error?.type as ErrorPreParsingRows)) {
            window.electron.removeChannel(RequestParseFile);
            pushMsg(makeItemFromMain(res));
            return;
          }
          if (res.error?.type !== ErrorParsingRow) {
            //  2. validate error
            updatePct(res.content);

            // prettier-ignore
            pushMsg(makeItemFromMain(res, (c: IContentValidateError) => {
              return `line: ${c.result.parseResult.nSavedRows}, error: ${res.error?.msg}`;
            }));
          } else {
            // 3. parse error
            resetPct();
            pushMsg(makeItemFromMain(res));
            pushMsg(makeItemFromText('解析有误，等待数据库更新……'));
          }
        } else if (res.content.msg === getSetting('string', MsgParseFileFinished)) {
          // 4. finished parsing
          pushMsg(makeItemFromText('读取完成，等待数据库更新……'));
          // 值得注意的是，finish的时候，就可以标记上传文件了，
          // prettier-ignore
          setUploaded([...uploaded, {
            fileName: getFileNameFromPath(req.fp),
            updateTime: new Date()
          }].slice(-getSetting('number', SET_MAX_UPLOAD_HISTORY)));
        } else if (res.content.msg === getSetting('string', MsgSaveDbFinished)) {
          // 5. finished saving
          resetPct();
          window.electron.removeChannel(RequestParseFile);
          pushMsg(makeItemFromMain(res, (c) => c.msg));
          pushMsg(
            makeItemFromText(renderResult((res.content as IContentParseFinish).result.dbResult))
          );
          console.log({ res });
        } else {
          // 6.  read one line
          updatePct(res.content);
        }
      });
    });

  const onClickUpload = async () => {
    const fp = await requestSelectFile();
    if (fp === null) return console.log('no valid file chose');
    return requestReadFile({ fp, isErp: true });
  };

  return (
    // ui refer: https://medium.muz.li/file-upload-ui-inspiration-a82949ed191b
    <div className={'min-w-1/2 max-w-full mt-8 overflow-auto'}>
      <UploadClick sizePct={sizePct} rowsPct={rowsPct} onClick={onClickUpload} />

      <Console items={consoles} />

      <UploadHistory items={uploaded} />
    </div>
  );
};

export default MenuUploadErp;
