# `hjxh_express_match`

1. [overview](#overview)
2. [init](#init)
3. [start app](#start-app)
4. [pack app for mac](#pack-app-for-mac)
5. [pack app for windows](#pack-app-for-windows)
6. [open app on mac](#open-app-on-mac)
    1. [1. using `open` command with console](#1-using-open-command-with-console)
    2. [2. directly open](#2-directly-open)
7. [check log](#check-log)
8. [scripts](#scripts)

## overview

the gui of menu-guidance:

![picture 2](.imgs/readme-1644505943397-7308f59e5b6e13c49824c0afc0697ab98f78815368444ac5b28728f1c19b7069.png)  

## init

```sh
git clone https://github.com/hjxh-opendata/hjxh-express-match-gui hjxh-express-match
cd hjxh-express-match
npm i
```

## start app

```sh
# dev
npm run start

# prop
npm run build && ./node_modules/.bin/electron release/app

# binary
```

It will auto create log directory and files under the application path when you first run this project (or later deleted them manually).

![picture 1](.imgs/readme-1644505703990-cf11e1cd910b52b9ac54c7e44f487b2a6a9350a55672a91b450492ca815154d3.png)  

the app root is:

- dev: `~/Library/Application Support/Electron`
- prod: `~/Library/Application Support/mark.hjxh.express_match`
- binary: `~/Library/Application Support/mark.hjxh.express_match`

the log dir is `$ROOT/logs`

the database path is `$ROOT/hjxh_data.sqlite`

## pack app for mac

1. :warning: ensure electron-mirror variable is `https://cdn.npm.taobao.org/dist/electron/` (see: [Advanced Installation Instructions | Electron](https://www.electronjs.org/docs/latest/tutorial/installation#mirror)) in env (`ELECTRON_MIRROR`) or `.npmrc | ~/.npmrc` (`electron_mirror`) or `build/electron-mirror` in `package.json`.
2. rebuild app, and pack mac/win

```sh
export ELECTRON_MIRROR=https://cdn.npm.taobao.org/dist/electron/
npm run app:dist
npm run pack:mac
```

## pack app for windows

It almost cost me 2-3 hours to get to realize:

- no need to install `node-gpy` and `node-pre-gpy`
- no need to set go proxy via `GOPROXY`

The only thing we need is to rebuild the native dependencies of `sqlite3`. 

```sh
npm run rebuild sqlite3
```

And then pack:

```sh
npm run pack:win
```

## open app on mac

### 1. using `open` command with console

```sh
open release/build/mac/HJXH-DATA-ANALYSIS.app/Contents/MacOS/HJXH-DATA-ANALYSIS
```

![picture 12](.imgs/readme-1644512933213-dd3defe0af8870886d74f5e5381b32fa572bf29ac72db887eafafa3b9845c8fd.png)  

### 2. directly open

```sh
open release/build/mac/HJXH-DATA-ANALYSIS.app
```

## check log

![picture 13](.imgs/readme-1644513445766-a9c7233f0060cb9cd4993b696b12eb004a01114a4c0b4ef3b58eb0a040d6e974.png)  

## scripts

```sh
# clear database (for dev)
npm run tnode scripts/script_clear_db.ts $DB_FILE_PATH
```
