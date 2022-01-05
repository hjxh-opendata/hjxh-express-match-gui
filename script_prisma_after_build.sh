client='node_modules/.prisma/client'

replace_to='// to save the hard search time(maybe from "/"), let us directly point out the target prisma client place
console.log({ process_cwd: process.cwd(), __dirname });
// to keep consistent, in local schema.prisma is besides this file(prisma/index.js)
// and in remote (main.js) we should also put files to there then.
const dirname = __dirname;
console.log({ dirname });

// const { findSync } = require("@prisma/client/runtime")
//
// const dirname = findSync(process.cwd(), [
//     "node_modules/.prisma/client",
//     ".prisma/client",
// ], ["d"`], ["d"], 1)[0] || __dirname
'

replace_from='const dirname = findSync.*?__dirname'

if grep -q 'const dirname = __dirname;' ${client}/index.js; then
  echo "skipped: prima index file has been changed"; else

  # change the default script
  echo "modifying ${client}/index.js"
  perl -i'.old' -p0e  "s\\${replace_from}\\${replace_to}\\s" ${client}/index.js
  # found: 0; not found: 1;
  if ! grep -q 'const dirname = __dirname;' ${client}/index.js; then
    grep --context=5 findSync ${client}/index.js
    echo "didn't match success!"
    exit 1;
  fi
  grep --context=3 findSync ${client}/index.js
  echo "modified successfully"
fi

# copy schema to under main, for initialization in binary
echo "copying schema.prisma to app main"
cp ${client}/schema.prisma release/app/dist/main/
echo "copied"

