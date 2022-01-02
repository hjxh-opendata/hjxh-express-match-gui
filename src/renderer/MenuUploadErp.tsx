import React, { useState } from 'react';

import { ConsoleItem } from './@types/console';

import { MsgParseFileFinished, MsgSaveDBFinished } from '../config/configBusiness';
import { MAX_CONSOLE_ITEMS, MAX_UPLOAD_HISTORY } from '../config/configSettings';
import { Level } from '../main/modules/base/response';
import { RequestParseFile } from '../main/modules/parseFile/channels';
import { ErrorParsingRow } from '../main/modules/parseFile/error_types';
import { IContentValidateError } from '../main/modules/parseFile/handler/parse_validate';
import { IReqParseFile } from '../main/modules/parseFile/request';
import { IResParseFile } from '../main/modules/parseFile/response';
import { RequestSelectFile } from '../main/modules/selectFile/channels';
import { IResSelectFile } from '../main/modules/selectFile/response';
import { getFileNameFromPath } from '../universal';

import { Console } from './components/Console';
import { UploadClick } from './components/UploadClick';
import UploadHistory, { IUploadItem } from './components/UploadHistory';

import { makeItemFromMain, makeItemFromText } from './utils/console';

/**
 * todo: [+++] 实现后台持久化log到文件
 * √: 实时在前端console刷新输出具体内容其实不太友好，而且会比较慢，比较合适的方法是在console输出进度条，而在F12里输出具体信息
 * @constructor
 */
export const MenuUploadErp = () => {
  const [consoles, setConsoles] = useState<ConsoleItem[]>([]);
  const [uploaded, setUploaded] = useState<IUploadItem[]>([]);
  const [percent, setPercent] = useState(0);

  const pushMsg = (msg: ConsoleItem) => {
    setConsoles((msgs) => [...msgs, msg].slice(-MAX_CONSOLE_ITEMS));
  };

  const requestSelectFile = () =>
    new Promise<string | null>((resolve) => {
      console.log('selecting file');
      window.electron.request(RequestSelectFile);
      window.electron.once(RequestSelectFile, (m: IResSelectFile) => {
        console.log('received files return: ', m);
        const { filePaths } = m.content;
        if (filePaths.length === 0) return pushMsg(makeItemFromText('cancelled'));
        if (filePaths.length > 1) return pushMsg(makeItemFromText('should filePaths.length === 1', Level.error));

        pushMsg(makeItemFromMain(m, (c) => `selected file: ${c[0]}`));

        const fp = filePaths[0];
        // check existed
        if (uploaded.some((i) => getFileNameFromPath(fp) === i.fileName))
          return pushMsg(
            makeItemFromText(`[UPLOAD DENY]: the file '${getFileNameFromPath(fp)}' has been uploaded!`, Level.warn)
          );
        return resolve(fp);
      });
    });

  const requestReadFile = (req: IReqParseFile) =>
    new Promise<boolean>(() => {
      pushMsg(makeItemFromText('reading file...')); // for placeholder
      window.electron.request(RequestParseFile, req);
      window.electron.on(RequestParseFile, (msg: IResParseFile) => {
        console.log(msg);
        if (msg.error?.msg) {
          if (msg.error?.type !== ErrorParsingRow) {
            //  2. validate error
            setPercent(msg.content.progress.percentage);
            // prettier-ignore
            pushMsg(makeItemFromMain(msg, (c: IContentValidateError) => {
              return `line: ${c.line}, error: ${msg.error?.msg}`;
            }));
          } else {
            // 3. parse error
            setPercent(0);
            pushMsg(makeItemFromMain(msg));
            pushMsg(makeItemFromText('解析有误，等待数据库更新……'));
          }
        } else if (msg.content.msg === MsgParseFileFinished) {
          // 4. finished parsing
          pushMsg(makeItemFromText('读取完成，等待数据库更新……'));
          // 值得注意的是，finish的时候，就可以标记上传文件了，
          // prettier-ignore
          setUploaded([...uploaded, {
            fileName: getFileNameFromPath(req.fp),
            updateTime: new Date()
          }].slice(-MAX_UPLOAD_HISTORY));
        } else if (msg.content.msg === MsgSaveDBFinished) {
          // 5. finished saving
          setPercent(0);
          window.electron.removeChannel(RequestParseFile);
          pushMsg(makeItemFromMain(msg, (c) => c.msg));
        } else {
          // 6.  read one line
          setPercent(msg.content.progress.percentage);
        }
      });
    });

  const onClickUpload = async () => {
    const fp = await requestSelectFile();
    if (fp === null) return console.log('no valid file chose');
    return requestReadFile({ fp });
  };

  return (
    // ui refer: https://medium.muz.li/file-upload-ui-inspiration-a82949ed191b
    <div className={'min-w-1/2 max-w-full mt-8 overflow-auto'}>
      <UploadClick readPct={percent} onClick={onClickUpload} />

      <Console items={consoles} />

      <UploadHistory items={uploaded} />
    </div>
  );
};

export default MenuUploadErp;
