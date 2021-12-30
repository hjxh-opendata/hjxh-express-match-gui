import progressStream from 'progress-stream';
import React, { useRef, useState } from 'react';

import { RequestParseFile, RequestSelectFile } from '../main/@types/channels';
import { IParseError } from '../main/@types/erp_parse';
import { ErrorParsingRow } from '../main/@types/errors/parse';
import { MsgFromMain, MsgLevel, OVER } from '../main/@types/event';
import { ConsoleItem } from './@types/console';

import { getFileNameFromPath } from '../main/utils';

import { Console } from './components/Console';
import { UploadClick } from './components/UploadClick';
import UploadHistory, { IUploadItem } from './components/UploadHistory';

import { makeItemFromMain, makeItemFromText } from './console';
import { dispProgress } from './utils/utils';

/**
 * todo: 实现后台持久化log到文件
 * √: 实时在前端console刷新输出具体内容其实不太友好，而且会比较慢，比较合适的方法是在console输出进度条，而在F12里输出具体信息
 * @constructor
 */
export const UploadErp = () => {
  const [consoles, setConsoles] = useState<ConsoleItem[]>([]);
  const [uploaded, setUploaded] = useState<IUploadItem[]>([]);

  // cnt 与 pct 是两个不同维度的数据，cnt用于条件阀门，pct用于比率显示
  const refReadingPct = useRef(0);

  const pushMsg = (msg: ConsoleItem) => {
    setConsoles((msgs) => [...msgs.slice(msgs.length === 100 ? 1 : 0), msg]);
  };

  const requestSelectFile = () =>
    new Promise<string | null>((resolve) => {
      console.log('selecting file');
      window.electron.request(RequestSelectFile);
      window.electron.once(RequestSelectFile, (m: MsgFromMain) => {
        console.log('received files return: ', m);
        const filePaths = m.content as string[];
        if (filePaths.length === 0)
          return pushMsg(makeItemFromText('cancelled'));
        if (filePaths.length > 1)
          return pushMsg(
            makeItemFromText('should filePaths.length === 1', MsgLevel.error)
          );

        pushMsg(makeItemFromMain(m, (c) => `selected file: ${c[0]}`));

        const fp = filePaths[0];
        // check existed
        if (uploaded.some((i) => getFileNameFromPath(fp) === i.fileName))
          return pushMsg(
            makeItemFromText(
              `[UPLOAD DENY]: the file '${getFileNameFromPath(
                fp
              )}' has been uploaded!`,
              MsgLevel.warn
            )
          );
        return resolve(fp);
      });
    });

  const requestReadFile = (fp: string) =>
    new Promise<boolean>((resolve) => {
      console.log('reading file');
      pushMsg(makeItemFromText('reading file...')); // for placeholder
      window.electron.request(RequestParseFile, fp);
      window.electron.on(RequestParseFile, (msg: MsgFromMain) => {
        console.log(msg);

        if (msg.error && msg.error !== ErrorParsingRow) {
          // validate error
          console.log(dispProgress((msg.content as IParseError).progress));
          pushMsg(
            makeItemFromMain(msg, (c: IParseError) => {
              refReadingPct.current = c.progress.percentage;
              return JSON.stringify(c);
            })
          );
        } else {
          refReadingPct.current = 0;
          window.electron.removeChannel(RequestParseFile);
          resolve(true); // function await
          if (msg.content === OVER) {
            // read finish
            pushMsg(makeItemFromText(OVER));
          } else {
            // parse file error
            pushMsg(makeItemFromText(msg.content as string));
          }
        }
      });
    });

  const onClickUpload = async () => {
    const filePath = await requestSelectFile();
    if (filePath === null) return console.log('no valid file chose');
    return requestReadFile(filePath);
  };

  return (
    // ui refer: https://medium.muz.li/file-upload-ui-inspiration-a82949ed191b
    <div className={'min-w-1/2 max-w-full pt-20'}>
      <div
        id={'upload-view'}
        className={'flex flex-wrap'}
        style={{ minHeight: 200 }}
      >
        <UploadClick readPct={refReadingPct.current} onClick={onClickUpload} />
        <UploadHistory items={uploaded} />
      </div>

      <Console items={consoles} />
    </div>
  );
};

export default UploadErp;
