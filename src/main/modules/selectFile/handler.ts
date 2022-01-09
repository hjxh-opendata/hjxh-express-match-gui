import { dialog } from 'electron';

import { LogLevel } from '../../base/interface/log';
import { IRes, genRes, reply } from '../../base/interface/response';

import { RequestSelectFile } from './interface/channels';
import { IContentSelectFile } from './interface/response';

/**
 *
 * To force the dialog always on top of the window, we should set the `mainWindow` parameter. ref:
 * - [electron/dialog.md at main · electron/electron](https://github.com/electron/electron/blob/main/docs/api/dialog.md#dialogshowopendialogbrowserwindow-options)
 * - [Electron: File dialog window should be focused until decision - Stack Overflow](https://stackoverflow.com/questions/50349157/electron-file-dialog-window-should-be-focused-until-decision)
 * @param e
 * @param mainWindow
 */
export const handlerSelectFile = async (e, mainWindow) => {
  console.log('selecting file');
  const openResult = await dialog.showOpenDialog(mainWindow, {
    title: '选择文件',
    message: '选择文件上传',
    properties: ['openFile'], // IMPROVE: multi-selection if possible
    filters: [{ name: '*', extensions: ['csv'] }], // 筛选要用 `csv`而不能用`.csv`，尽管在Mac上没问题，但是windows没法识别
  });
  console.log('openResult: ', openResult);
  const resSelectFile: IRes<IContentSelectFile> = genRes(
    { filePaths: openResult.filePaths },
    LogLevel.info
  );
  reply(e, RequestSelectFile, resSelectFile);
};
