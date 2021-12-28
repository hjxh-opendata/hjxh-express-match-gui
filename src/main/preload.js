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
exports.API_KEY = 'electron';
exports.api = {
    heartBeats: function () {
        electron_1.ipcRenderer.send('ping');
    },
    request: electron_1.ipcRenderer.send,
    removeChannel: electron_1.ipcRenderer.removeAllListeners,
    on: function (channel, func) {
        electron_1.ipcRenderer.on(channel, function (_) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return func.apply(void 0, args);
        });
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
