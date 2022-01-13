import { app } from 'electron';
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
  let f = `${ps2(d.getHours())}-${ps2(d.getMinutes())}-${ps2(d.getSeconds())}`;
  f = path.join(ps2(d.getDate()), f);
  f = path.join(ps2(d.getMonth() + 1), f);
  f = path.join(ps2(d.getFullYear()), f);
  return f;
  // return `${d.getFullYear()}/${ps2(d.getMonth() + 1)}/${ps2(d.getDate())}/${ps2(
  //   d.getHours()
  // )}:${ps2(d.getMinutes())}:${ps2(d.getSeconds())}`;
};

let logFilePath: string = undefined as unknown as string;
export const getLogPath = () => {
  if (!logFilePath) {
    const fileName = getFormattedDate() + '.log';
    const rootPath = getRootPath();
    const logRootPath = path.join(rootPath, 'logs');
    console.log('initializing log path');
    if (!fs.existsSync(logRootPath)) {
      console.log('log root not existed, creating');
      fs.mkdirSync(logRootPath);
    }
    logFilePath = path.join(logRootPath, fileName);
    const logDirPath = path.dirname(logFilePath);

    /**
     * for windows, since they can not auto create dir
     */
    if (!fs.existsSync(logDirPath)) {
      console.log('log dir not existed, creating');
      fs.mkdirSync(logDirPath, { recursive: true });
    }
  }

  return logFilePath;
};

export const getDbPath = () => path.join(getRootPath(), 'hjxh_data.sqlite');
