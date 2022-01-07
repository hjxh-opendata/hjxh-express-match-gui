"use strict";
exports.__esModule = true;
exports.api = exports.API_KEY = void 0;
/**
 * simplify the api lever from 3 to 2
 *
 * Attention:
 * 1. anything in this preload script can not be imported into the main process, since the `contextBridge` is undefined in the main
 * 2. It's better not to import any variables from other places into this file, if using the `tsc` to transpile this file, in case of the `emit skipped` error
 */
var electron_1 = require("electron");
var channels_1 = require("./settings/channels");
exports.API_KEY = 'electron';
/**
 * attention:
 * logs in this file, will go to the renderer console, not the main !
 */
exports.api = {
    heartBeats: function () { return electron_1.ipcRenderer.send('ping'); },
    getSettings: function () { return electron_1.ipcRenderer.sendSync(channels_1.GET_SETTINGS); },
    getSetting: function (type, name) { return electron_1.ipcRenderer.sendSync(channels_1.GET_SETTING, type, name); },
    setSetting: function (type, name, val) { return electron_1.ipcRenderer.sendSync(channels_1.SET_SETTING, type, name, val); },
    request: electron_1.ipcRenderer.send,
    removeChannel: function (channel) {
        electron_1.ipcRenderer.removeAllListeners(channel);
        // console.log(`disabled channel: ${channel}`);
    },
    listListeners: function (channel) {
        console.log("listing listeners of ".concat(channel));
        console.log(electron_1.ipcRenderer.rawListeners(channel));
    },
    on: function (channel, func) {
        electron_1.ipcRenderer.on(channel, function (_) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return func.apply(void 0, args);
        });
        // console.log(`enabled channel: ${channel}`);
    },
    once: function (channel, func) {
        electron_1.ipcRenderer.once(channel, function (_) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return func.apply(void 0, args);
        });
    }
};
electron_1.contextBridge.exposeInMainWorld(exports.API_KEY, exports.api);
