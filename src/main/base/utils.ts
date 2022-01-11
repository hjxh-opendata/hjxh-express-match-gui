import electron, { app } from 'electron';
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

export const getLogPath = () => path.join(getRootPath(), 'main.log');

export const getDbPath = () => path.join(getRootPath(), 'hjxh_data.sqlite');
