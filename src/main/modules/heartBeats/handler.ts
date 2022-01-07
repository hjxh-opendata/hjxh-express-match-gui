import { IpcMainEvent } from '../base/response';

import { Ping } from './channels';

/**
 * this is for heartbeats
 *
 * @param e{IpcMainEvent}:
 * @returns {Promise<void>}
 */
export const handlePing = async (e: IpcMainEvent) => {
  console.log('received ping');
  e.reply(Ping, 'pong');
};
