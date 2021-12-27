export enum Channels {
  ping = 'ping',
  requestSelectFile = 'requestSelectFile',
  requestReadFile = 'requestReadFile',
}

export const getTime = () => {
  return new Date().toLocaleString();
};
