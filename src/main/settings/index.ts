import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

import { Status } from '../const';

import { BooleanKeys, booleanSettings } from './boolean_settings';
import { NumberKeys, numberSettings } from './number_settings';
import { StringKeys, stringSettings } from './string_settings';

export const SETTINGS_PATH = path.join(__dirname, 'settings.yaml');

let settings = {
  boolean: booleanSettings,
  number: numberSettings,
  string: stringSettings,
};

export type SettingKeyType = keyof typeof settings;
export type SettingKeyName = BooleanKeys | NumberKeys | StringKeys;

export const mainDumpSettings = () => {
  try {
    fs.writeFileSync(SETTINGS_PATH, yaml.dump(settings));
  } catch (e) {
    console.error(e);
  }
};

export const mainLoadSettings = () => {
  try {
    // force reload
    mainDumpSettings();
    settings = yaml.load(fs.readFileSync(SETTINGS_PATH, 'utf8')) as typeof settings;
    return settings;
  } catch (e) {
    console.error(e);
    return Status.ERROR;
  }
};

export const mainGetSetting = (type: SettingKeyType, name: SettingKeyName) => settings[type][name];

export const mainSetSetting = (type: SettingKeyType, name: SettingKeyName, val) => {
  try {
    settings[type][name] = val;
    mainDumpSettings();
    console.log(settings);
    return Status.OK;
  } catch (e) {
    console.error(e);
    return Status.ERROR;
  }
};

mainLoadSettings();
