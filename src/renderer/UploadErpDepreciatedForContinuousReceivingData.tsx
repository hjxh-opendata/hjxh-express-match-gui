import progressStream from 'progress-stream';
import React, { useRef, useState } from 'react';

import { RequestParseFile, RequestSelectFile } from '../main/@types/channels';
import { MsgFromMain, MsgLevel, OVER } from '../main/@types/event';
import { getFileNameFromPath } from '../main/utils';

import { Console } from './components/Console';
import { UploadClick } from './components/UploadClick';
import UploadHistory, { IUploadItem } from './components/UploadHistory';

import { ConsoleItem } from './@types/console';
import { makeItemFromMain, makeItemFromText } from './console';
import { dispProgress } from './utils/utils';
import { ErrorParsingRow } from '../main/@types/errors/parse';

/**
 * todo: 实现后台持久化log到文件
 * √: 实时在前端console刷新输出具体内容其实不太友好，而且会比较慢，比较合适的方法是在console输出进度条，而在F12里输出具体信息
 * @constructor
 */
export const UploadErp = () => {
  const [consoles, setConsoles] = useState<ConsoleItem[]>([]);
  const [uploaded, setUploaded] = useState<IUploadItem[]>([]);

  // cnt 与 pct 是两个不同维度的数据，cnt用于条件阀门，pct用于比率显示
  const refReadingCnt = useRef(0);
  const refReadingPct = useRef(0);

  const pushMsg = (msg: ConsoleItem) => {
    if (!refReadingCnt.current) {
      // 没有在读取读取文件
      setConsoles((msgs) => [...msgs.slice(msgs.length === 100 ? 1 : 0), msg]);
    } else {
      // 正在读取文件
      setConsoles((msgs) => [...msgs.slice(0, msgs.length - 1), msg]);
    }
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

        if(msg.content !== OVER && msg.error !== ErrorParsingRow) {
          refReadingCnt.current += 1;
          // 控频率
          if (msg.content.progress && refReadingCnt.current % 10000 === 1) {
            refReadingPct.current = msg.content.progress.percentage;
            pushMsg(
              makeItemFromMain(msg, (c) =>
                dispProgress(c.progress as progressStream.Progress)
              )
            );
          }
        }

        if (msg.content === OVER) {
          refReadingCnt.current = refReadingPct.current = 0; // reset
          setUploaded([
            ...uploaded,
            { fileName: getFileNameFromPath(fp), updateTime: new Date() }
          ]);
          console.log('content is over');
          pushMsg(makeItemFromText('reading finished'));
          window.electron.removeChannel(RequestParseFile);
          resolve(true);
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
