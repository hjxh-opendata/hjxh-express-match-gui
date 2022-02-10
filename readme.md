# `hjxh_express_match`

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
- TODO: binary: ``

the log dir is `$ROOT/logs`

the database path is `$ROOT/hjxh_data.sqlite`

## scripts

```sh
# clear database (for dev)
npm run tnode scripts/script_clear_db.ts $DB_FILE_PATH
```
