app='/Users/mark/Documents/mark_projects/hjxh/hjxh_express_match/erb/release/build/mac/HJXH-DATA-ANALYSIS.app/Contents/Resources/app'

cd $app

echo "installing 'prisma', '@prisma/client'"
#npm i prisma @prisma/client

engine='node_modules/.prisma/client/libquery_engine-darwin.dylib.node'
if [[ ! -f $engine ]]; then
  echo "not exist query engin"
  exit 1;
fi
echo "passed query engin"
cp $engine dist/main/

echo "moving prisma query engin"


if [[ ! -f node_modules/.bin/prisma ]]; then
  echo "not exist prisma bin"
  exit 1;
fi
echo "passed prisma bin test"

if [[ ! -f dist/main/schema.prisma ]]; then
  echo "not exist prisma schema"
  exit 2;
fi
echo "passed prisma schema test"

if ! grep -q "process_cwd" 'dist/main/main.js'; then
  echo "not exist target text in main.js"
  exit 3;
fi
echo "passed main.js test"

echo "passed"


echo "opening programme"
open ../../MacOS/HJXH-DATA-ANALYSIS
echo "opened"
