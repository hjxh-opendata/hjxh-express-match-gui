import { DAYS, HOURS, MINUTES, MONTHS, SECONDS, YEARS } from './ch';

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
