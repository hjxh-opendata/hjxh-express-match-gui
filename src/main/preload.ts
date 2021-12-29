/**
 * simplify the api lever from 3 to 2
 *
 * Attention:
 * 1. anything in this preload script can not be imported into the main process, since the `contextBridge` is undefined in the main
 * 2. It's better not to import any variables from other places into this file, if using the `tsc` to transpile this file, in case of the `emit skipped` error
 */
import { contextBridge, ipcRenderer } from 'electron';

export const API_KEY = 'electron';

/**
 * attention:
 * logs in this file, will go to the renderer console, not the main !
 */
export const api = {
  heartBeats: () => ipcRenderer.send('ping'),
  request: ipcRenderer.send,
  removeChannel: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
    console.log(`disabled channel: ${channel}`);
  },
  listListeners: (channel: string) => {
    console.log(`listing listeners of ${channel}`);
    console.log(ipcRenderer.rawListeners(channel));
  },
  on(channel, func) {
    ipcRenderer.on(channel, (_, ...args) => func(...args));
    console.log(`enabled channel: ${channel}`);
  },
  once(channel, func) {
    ipcRenderer.once(channel, (_, ...args) => func(...args));
  },
};

contextBridge.exposeInMainWorld(API_KEY, api);
