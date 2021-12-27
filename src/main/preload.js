const { contextBridge, ipcRenderer } = require('electron');

const api = {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    requestReadFile() {
      ipcRenderer.send('requestReadFile');
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      ipcRenderer.once(channel, (event, ...args) => func(...args));
    },
  },
};
contextBridge.exposeInMainWorld('electron', api);

module.exports = api;
