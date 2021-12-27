/**
 * simplify the api lever from 3 to 2
 *
 * Attention:
 * 1. anything in this preload script can not be imported into the main process, since the `contextBridge` is undefined in the main
 * 2. It's better not to import any variables from other places into this file, if using the `tsc` to transpile this file, in case of the `emit skipped` error
 */
import { contextBridge, ipcRenderer } from 'electron';

export const API_KEY = 'electron';

export const api = {
  heartBeats() {
    ipcRenderer.send('ping');
  },
  request: ipcRenderer.send,
  on(channel, func) {
    ipcRenderer.on(channel, (_, ...args) => func(...args));
  },
  once(channel, func) {
    ipcRenderer.once(channel, (_, ...args) => func(...args));
  },
};

contextBridge.exposeInMainWorld(API_KEY, api);
