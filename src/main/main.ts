/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import { BrowserWindow, app, ipcMain, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import path from 'path';
// typeorm support
import 'reflect-metadata';
import 'regenerator-runtime/runtime';
import { URL } from 'url';

import { createDefaultDatabase } from './base/db/conn';
import { mainGetSetting, mainLoadSettings, mainSetSetting } from './base/settings';
import { GET_SETTING, GET_SETTINGS, SET_SETTING } from './base/settings/channels';
import { getLogPath } from './base/utils';
import MenuBuilder from './menu';
import { Ping } from './modules/heartBeats/const';
import { handlePing } from './modules/heartBeats/handler';
import { handleParseFile } from './modules/parseFile/handler';
import { RequestParseFile } from './modules/parseFile/interface/channels';
import { handleQueryDatabase } from './modules/queryDB/handler';
import { RequestQueryDatabase } from './modules/queryDB/interface';
import { handlerSelectFile } from './modules/selectFile/handler';
import { RequestSelectFile } from './modules/selectFile/interface/channels';

/**
 * add log to file support
 * ref: https://github.com/megahertz/electron-log#overriding-consolelog
 */
const logPath = getLogPath();
console.log({ logPath });
log.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s},{ms} [{level}] {text}';
log.transports.file.resolvePath = () => logPath;
// @ts-ignore
console.log = log;
Object.assign(console, log.functions);

/**
 * init database
 */
const dbPath = path.join(app.getPath('appData'), 'hjxh_data.sqlite');
console.log({ dbPath });
createDefaultDatabase(dbPath);

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify().catch(console.error);
  }
}

/**
 * electron main window
 *
 * @type {BrowserWindow}
 */
let mainWindow: BrowserWindow | null = null;

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
} else {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

export const resolveHtmlPath = (htmlFileName: string) => {
  if (process.env.NODE_ENV !== 'development')
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;

  const port = process.env.PORT || 1212;
  const url = new URL(`http://localhost:${port}`);
  url.pathname = htmlFileName;
  return url.href;
};

export const installExtensions = async () => {
  // eslint-disable-next-line global-require
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
    // await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1200,
    height: 800,
    // custom app icon
    icon: getAssetPath('icon.icns'),
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
  // new AppUpdater();
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
  .then(async () => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

ipcMain.on(Ping, handlePing);

// it needs mainWindow focus
ipcMain.on(RequestSelectFile, (e, isErp) => handlerSelectFile(e, mainWindow, isErp));

ipcMain.on(RequestParseFile, handleParseFile);

ipcMain.on(RequestQueryDatabase, handleQueryDatabase);

ipcMain.on(GET_SETTINGS, (e) => (e.returnValue = mainLoadSettings()));

ipcMain.on(GET_SETTING, (e, type, name) => (e.returnValue = mainGetSetting(type, name)));

ipcMain.on(SET_SETTING, (e, type, name, val) => (e.returnValue = mainSetSetting(type, name, val)));
