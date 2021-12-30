import { MsgLevel } from '../../main/@types/event';

export interface ConsoleItem {
  text: string;
  time: Date;
  level: MsgLevel;
}
