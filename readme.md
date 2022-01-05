# Electron-Prisma-Sqlite3-Webpack, All is nothing but a mess

## My terrible and hard time with prisma

### Everything runs well before typoorm comes.

### Now the things get even worse after prisma replaced typoorm.

### HollyShit, I realized that prisma may not be suitable for my project.

## How can make electron and prisma work together

### Approach 1. synchronize step by step

```shell

# run in dev
prisma genrate

electron .

# run in prod

npm run build

cp -r prisma release/app/

cd release/app

prisma genrate 

electron .


# run in pack under electron
cd ../..

npm run rebuild  # or `npm run postinstall`

electron-rebuild build --mac/win 

cp -r prisma TARGET_APP/

cd TARGET_APP

prisma generate

electron .

# run in pack with the electron helper (Mac)
# this way can show the main log, `process.cwd() = ~`

cd ../../MacOS

open TARGET_APPP_HELPER


# run in pack by double click (Mac)
# this way no log, `process.cwd() = /`
# since the func of `findSync` of prisma would search from root to project,
# which would be rather time-cost, even 1-2 minutes startup
cd ../..

open .

# run in pack by double click (Mac) solutions
# 1. put programme to a place closer to the root
#    the best suitable place is /Application/, which also indicates an installation is preferred
mv APP /Applications/
open /Applications/APP

# 2. change the function of `findSync` in `app/node_modules/.prisma/client/index.js`,
#    in order to shorten the search time, e.g. just let `const dirname = __dirname`
```

### Approach 2. customize the need

In fact, the prisma generally needs three things.

#### First, the `.prisma/client/index.js` initialized after `prisma generate`.

While in order to operate `prisma generate`, we need a prisma runner, and a schema file.

That's where it comes: `npm i prisma @prisma/generate && prisma generate`.

If you don't have one schema file, it would tell you to crete or copy one (especially with a `User` model).

#### Second, the `query engion`.

in Approach 1, since we always use `prisma generate` and keeps the schema file synchronized with the app,

we won't occur the `query-engion can't be found` problem.

But things won't be easy if we customize all the way, e.g. specify a schema path, a schema bin, and so on.

I used to try a solution, i.e. to keep `schema.prisma, query-engin` all just at the `main` directory,

and the `/.bin/prisma` is under the `node_modules` with no doubt.

#### Third, the `/.bin/prisma`.

This is useful when you want to use prisma cli in the runtime.

e.g. dynamically change the DATABASE_URL to under the USER_DATA directory,

which can only be done in runtime and we need still put a default DATABASE_ENV .env variable in case for any compile
problem.

#### conclusion

Anyway, the customized approach is more like what lacks what saves.

It's a bit silly, but it does work well since you are always in a righter way.

## Some Mechanism Not Yet Understood

1. Would there be some magic so that allows me to make things smoother? Did I miss some points?

For example, maybe some packages should put into one specific package.json, or not, which do different effects on this
project.

Just think of `sqlite3` which is put into `release/app/package.json`,

then detected by electron-builder native and triggers post-install.

2. What's the relationship between `prisma` and `@prisma/client`,

since sometimes one of them would generate `.bin`, while sometimes not.

And what on the earth should be put into dependencies or devDependencies in packages.json of project or release.

3. some annoying problem concerned with webpack or electron-builder

    1. `process.env.DATABASE_URL`. When I wanna to dynamically change the DATABASE_URL from `env` level, the easiest way
       is to use `proces.env.DATABASE_URL`, however, which would cause webpack left assignment error if I wanna to
       let `process.env.DATABASE_URL = xxx` since they would be change to two const string comparison in compile time.
       And what's even more terrible is that webpack does't provide the remedy to suppress this behavior except for some
       specific variables like `process.env.NODE_ENV`, `__dirname` and `__filename`.
    2. `.env` upload. Since electron-builder stopped us to pack `.env` file into binary, which seems secure but rather
       inflexible, which forces us to make a rename and push and then rename again for the use by prisma.
    3. `.bin | @prisma/client/index.d.ts`, these files are also be treated as not allowed to pack into app, and then the
       cost is that we need generate the `.bin` again and again, along with cp the `@prisma/client/index.d.ts` file
       since an error would throw when we don't have this file even in the runtime which I could't understand. Why
       the `d.ts` should be used in runtime?


