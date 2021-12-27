export enum ApiKey {
  on = 'on',
  ping = 'ping',
  requestReadFile = 'requestReadFile',
}

export type Callback = (data: any, e?: Event) => void;
