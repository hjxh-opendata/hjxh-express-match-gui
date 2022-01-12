import electron, { app } from 'electron';
import fs from 'fs';
import path from 'path';

export const isDebugEnabled = () => {
  return process.env.DEBUG !== undefined;
};

export const isDebugDBEnabled = () => {
  return ['*', 'db'].includes(process.env.DEBUG || '');
};

export const isDebugFileEnabled = () => {
  return ['*', 'file'].includes(process.env.DEBUG || '');
};

// console.log({ appPath: app.getAppPath() });
// console.log({ appDataPath: app.getPath('appData') });
// console.log({ userDataPath: app.getPath('userData') });
// console.log({ logsPath: app.getPath('logs') });
// console.log({ exePath: app.getPath('exe') });
export const getRootPath = () => app.getPath('userData');

const ps2 = (s: number) => s.toString().padStart(2, '0');

export const getFormattedDate = () => {
  const d = new Date();
  return `${d.getFullYear()}/${ps2(d.getMonth() + 1)}/${ps2(d.getDate())}/${ps2(
    d.getHours()
  )}:${ps2(d.getMinutes())}:${ps2(d.getSeconds())}`;
};

let logPath: string = undefined as unknown as string;
export const getLogPath = () => {
  if (!logPath) {
    const fileName = getFormattedDate() + '.log';
    const rootPath = getRootPath();
    const logDirPath = path.join(rootPath, 'logs');
    console.log('initializing log path');
    if (!fs.existsSync(logDirPath)) {
      console.log('log dir not existed, creating');
      fs.mkdirSync(logDirPath);
    }
    logPath = path.join(logDirPath, fileName);
  }

  return logPath;
};

export const getDbPath = () => path.join(getRootPath(), 'hjxh_data.sqlite');
