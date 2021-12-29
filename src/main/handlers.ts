import * as csv from '@fast-csv/parse';
import { dialog } from 'electron';
import fs from 'fs';
import iconv from 'iconv-lite';
import progressStream from 'progress-stream';

import {
  Channels,
  Errors,
  MsgFromMain,
  OVER,
  ValidEncoding,
  makeMsgFromMain,
} from '../universal';

import { testCsvEncoding } from './util';

import ReadWriteStream = NodeJS.ReadWriteStream;

interface IpcMainEvent extends Event {
  // eslint-disable-next-line @typescript-eslint/ban-types
  reply: Function;
}

export const handlePing = async (e) => {
  console.log('received ping');
  e.reply(Channels.ping, 'pong');
};

export const reply = (e: IpcMainEvent, channel: Channels, msg: MsgFromMain) => {
  e.reply(channel, msg);
};

/**
 *
 * To force the dialog always on top of the window, we should set the `mainWindow` parameter. ref:
 * - [electron/dialog.md at main · electron/electron](https://github.com/electron/electron/blob/main/docs/api/dialog.md#dialogshowopendialogbrowserwindow-options)
 * - [Electron: File dialog window should be focused until decision - Stack Overflow](https://stackoverflow.com/questions/50349157/electron-file-dialog-window-should-be-focused-until-decision)
 * @param e
 * @param mainWindow
 */
export const handleSelectFile = async (e, mainWindow) => {
  console.log('selecting file');
  const openResult = await dialog.showOpenDialog(mainWindow, {
    title: '选择文件',
    message: '选择文件上传',
    properties: [
      'createDirectory',
      'openDirectory',
      'openFile',
      'multiSelections', // todo: enabled just for test now
    ],
    filters: [{ name: '*', extensions: ['.csv'] }],
  });
  console.log({ openResult });
  reply(
    e,
    Channels.requestSelectFile,
    makeMsgFromMain(null, openResult.filePaths)
  );
};

export const handleReadFile = async (e, fp: string) => {
  console.log(`reading file, name: ${fp}`);
  const encoding = await testCsvEncoding(fp);
  console.log({ encoding });
  if (!(encoding in ValidEncoding))
    return console.log(Errors.ErrorUnknownEncoding);

  let progress;
  const pipeProgress = progressStream(
    { length: fs.statSync(fp).size, time: 100 },
    (_) => (progress = _)
  );
  let s = fs.createReadStream(fp) as unknown as ReadWriteStream;
  if (encoding === ValidEncoding.gbk)
    s = s.pipe(iconv.decodeStream('gbk')).pipe(iconv.encodeStream('utf-8'));

  return s
    .pipe(pipeProgress)
    .pipe(csv.parse({ headers: false, encoding: 'utf-8' }))
    .on('data', (item: any) => {
      reply(
        e,
        Channels.requestReadFile,
        makeMsgFromMain(null, { item, progress })
      );
    })
    .on('error', console.error)
    .on('end', () => {
      console.log('finished');
      reply(e, Channels.requestReadFile, makeMsgFromMain(null, OVER));
    });
};
