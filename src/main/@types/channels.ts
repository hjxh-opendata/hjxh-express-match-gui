export const Ping = 'Ping';
export type Ping = typeof Ping;

export const RequestSelectFile = 'RequestSelectFile';
export type RequestSelectFile = typeof RequestSelectFile;

export const RequestParseFile = 'RequestReadFile';
export type RequestReadFile = typeof RequestParseFile;

export type Channels = Ping | RequestSelectFile | RequestReadFile;
