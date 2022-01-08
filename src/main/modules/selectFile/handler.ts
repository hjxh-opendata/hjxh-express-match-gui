import { dialog } from 'electron';

import { reply } from '../../base/response';

import { RequestSelectFile } from './channels';
import { IResSelectFile, genResSelectFile } from './response';

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
    properties: [
      // 'createDirectory',
      // 'openDirectory', // ! cannot add this choice since it would cause windows cannot select file
      'openFile',
      // 'multiSelections', // todo: [-----] enabled just for test now
    ],
    // 筛选要用 `csv`而不能用`.csv`，尽管在Mac上没问题，但是windows没法识别
    filters: [{ name: '*', extensions: ['csv'] }],
  });
  console.log({ openResult });
  const resSelectFile: IResSelectFile = genResSelectFile(openResult.filePaths);
  reply(e, RequestSelectFile, resSelectFile);
};
