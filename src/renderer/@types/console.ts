import { LogLevel } from '../../main/modules/base/response';

export interface ConsoleItem {
  text: string;
  time: Date;
  level: LogLevel;
}
