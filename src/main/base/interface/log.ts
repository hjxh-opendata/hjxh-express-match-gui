/**
 * log part
 */
export enum LogLevel {
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
}

export const getLogLevelInt = (level: LogLevel) => {
  switch (level) {
    case LogLevel.debug:
      return 0;
    case LogLevel.info:
      return 1;
    case LogLevel.warn:
      return 2;
    case LogLevel.error:
      return 3;
    default:
      throw new Error('impossible');
  }
};
