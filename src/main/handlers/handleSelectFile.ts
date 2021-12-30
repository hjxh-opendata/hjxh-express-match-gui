import { dialog } from 'electron';

import { RequestSelectFile } from '../@types/channels';
import { makeMsgFromMain, reply } from '../utils';

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
  reply(e, RequestSelectFile, makeMsgFromMain(null, openResult.filePaths));
};
