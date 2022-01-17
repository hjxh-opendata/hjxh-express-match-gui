import progressStream from 'progress-stream';

import { SettingKeyName, SettingKeyType } from '../main/base/settings';
import { IParsingProgress } from '../main/modules/parseFile/interface/rows';

export const dispProgress = (ps: progressStream.Progress) => {
  const DIVIDER = 1024 * 1024;
  const transferred = (ps.transferred / DIVIDER).toFixed(1);
  const length = (ps.length / DIVIDER).toFixed(1);
  const speed = (ps.speed / DIVIDER).toFixed(1);
  const s = `[${transferred} / ${length} Mb] speed: ${speed}/Mb, remaining: ${ps.eta}s, total: ${ps.runtime}s`;
  return s;
};

export const getSetting = (type: SettingKeyType, name: SettingKeyName) =>
  window.electron.getSetting(type, name);

export const setSetting = (type: SettingKeyType, name: SettingKeyName, val) =>
  window.electron.setSetting(type, name, val);

export const getSettings = () => window.electron.getSettings();

export const renderProgressing = (progress: IParsingProgress) =>
  `总条目数（${progress.nRowsTotal}）
   = 成功（${progress.nRowsSuccess}） 
   + 字段检验失败（${progress.nRowsFailedForValidation}） 
   + 数据库存储失败(${progress.nRowsFailedForStoringDB})`;
