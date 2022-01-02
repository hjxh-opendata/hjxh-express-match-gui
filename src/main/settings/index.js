"use strict";
exports.__esModule = true;
exports.mainSetSetting = exports.mainGetSetting = exports.mainLoadSettings = exports.mainDumpSettings = exports.SETTINGS_PATH = void 0;
var fs = require("fs");
var yaml = require("js-yaml");
var path = require("path");
var const_1 = require("../const");
var boolean_settings_1 = require("./boolean_settings");
var number_settings_1 = require("./number_settings");
var string_settings_1 = require("./string_settings");
exports.SETTINGS_PATH = path.join(__dirname, 'settings.yaml');
var settings = {
    boolean: boolean_settings_1.booleanSettings,
    number: number_settings_1.numberSettings,
    string: string_settings_1.stringSettings
};
var mainDumpSettings = function () {
    try {
        fs.writeFileSync(exports.SETTINGS_PATH, yaml.dump(settings));
    }
    catch (e) {
        console.error(e);
    }
};
exports.mainDumpSettings = mainDumpSettings;
var mainLoadSettings = function () {
    try {
        // force reload
        (0, exports.mainDumpSettings)();
        settings = yaml.load(fs.readFileSync(exports.SETTINGS_PATH, 'utf8'));
        return settings;
    }
    catch (e) {
        console.error(e);
        return const_1.Status.ERROR;
    }
};
exports.mainLoadSettings = mainLoadSettings;
var mainGetSetting = function (type, name) { return settings[type][name]; };
exports.mainGetSetting = mainGetSetting;
var mainSetSetting = function (type, name, val) {
    try {
        settings[type][name] = val;
        (0, exports.mainDumpSettings)();
        console.log(settings);
        return const_1.Status.OK;
    }
    catch (e) {
        console.error(e);
        return const_1.Status.ERROR;
    }
};
exports.mainSetSetting = mainSetSetting;
(0, exports.mainLoadSettings)();
