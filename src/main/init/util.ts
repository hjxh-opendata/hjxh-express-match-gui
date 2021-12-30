/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import path from 'path';
import { URL } from 'url';

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
