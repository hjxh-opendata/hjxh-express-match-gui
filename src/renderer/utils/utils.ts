import progressStream from 'progress-stream';

import { DAYS, HOURS, MINUTES, MONTHS, SECONDS, YEARS } from '../@types/locales/ch';

import { IDbResult, resultTrans } from '../../main/modules/db/db_result';

export const dispProgress = (ps: progressStream.Progress) => {
  const DIVIDER = 1024 * 1024;
  const transferred = (ps.transferred / DIVIDER).toFixed(1);
  const length = (ps.length / DIVIDER).toFixed(1);
  const speed = (ps.speed / DIVIDER).toFixed(1);
  const s = `[${transferred} / ${length} Mb] speed: ${speed}/Mb, remaining: ${ps.eta}s, total: ${ps.runtime}s`;
  return s;
};

export function timeSince(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} ${YEARS}`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} ${MONTHS}`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} ${DAYS}`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} ${HOURS}`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} ${MINUTES}`;
  }
  return `${Math.floor(seconds)} ${SECONDS}`;
}

export const getSetting = (type, name) => window.electron.getSetting(type, name);

export const setSetting = (type, name, val) => window.electron.setSetting(type, name, val);

export const getSettings = () => window.electron.getSettings();

export const renderResult = (result: IDbResult): string => {
  return Object.keys(result)
    .filter((k) => result[k] > 0)
    .sort((a1, a2) => result[a1] - result[a2])
    .map((k) => `${resultTrans[k]}: ${result[k]}`)
    .join(', ');
};
