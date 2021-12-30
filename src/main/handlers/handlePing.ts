import { Ping } from '../@types/channels';

export const handlePing = async (e) => {
  console.log('received ping');
  e.reply(Ping, 'pong');
};
