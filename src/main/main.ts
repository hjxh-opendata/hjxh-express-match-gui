/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import * as csv from '@fast-csv/parse';
import 'core-js/stable';
import { BrowserWindow, app, dialog, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import fs from 'fs';
import iconv from 'iconv-lite';
import path from 'path';
import 'regenerator-runtime/runtime';

import {
  Channels,
  MsgFromMain,
  MsgLevel,
  OVER,
  ValidEncoding,
} from '../universal';

import MenuBuilder from './menu';
import { TestCSVEncodingError, resolveHtmlPath, testCsvEncoding } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify().catch(console.error);
  }
}

let mainWindow: BrowserWindow | null = null;

interface IpcMainEvent extends Event {
  // eslint-disable-next-line @typescript-eslint/ban-types
  reply: Function;
}
export const reply = (e: IpcMainEvent, channel: Channels, msg: MsgFromMain) => {
  e.reply(channel, msg);
};

ipcMain.on(Channels.ping, async (e) => {
  console.log('received ping');
  e.reply(Channels.ping, 'pong');
});

ipcMain.on(Channels.requestSelectFile, async (e) => {
  console.log('selecting file');
  const openResult = await dialog.showOpenDialog({
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
  reply(e, Channels.requestSelectFile, {
    sendTime: new Date(),
    content: openResult.filePaths,
    level: MsgLevel.info,
  });
});

ipcMain.on(Channels.requestReadFile, async (e, fp: string) => {
  console.log(`reading file, name: ${fp}`);
  try {
    const encoding = await testCsvEncoding(fp);
    console.log({ encoding });
    switch (encoding) {
      case ValidEncoding.utf_8:
        return (
          fs
            .createReadStream(fp)
            .pipe(csv.parse({ encoding: 'utf-8', headers: true }))
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .pipe((s: any) => {
              console.log(s);
              reply(e, Channels.requestReadFile, {
                sendTime: new Date(),
                content: s,
                level: MsgLevel.debug,
              });
            })
        );
      case ValidEncoding.gbk:
        return (
          fs
            .createReadStream(fp)
            .pipe(iconv.decodeStream('gbk'))
            .pipe(iconv.encodeStream('utf-8'))
            // 不要加 header，太慢了
            .pipe(csv.parse({ headers: false }))
            .on('data', (item: any) => {
              reply(e, Channels.requestReadFile, {
                sendTime: new Date(),
                content: item,
                level: MsgLevel.debug,
              });
            })
            .on('error', console.error)
            .on('end', () => {
              console.log('finished');
            })
        );
      default:
        console.error('impossible');
    }
  } catch (error: unknown) {
    if (!(error instanceof TestCSVEncodingError)) throw error;
    return reply(e, Channels.requestReadFile, {
      error: error.message,
      level: MsgLevel.error,
      sendTime: new Date(),
    });
  } finally {
    reply(e, Channels.requestReadFile, {
      level: MsgLevel.info,
      content: OVER,
      sendTime: new Date(),
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
