PACKAGE_JSON="release/app/package.json"

if [[ ! -f $PACKAGE_JSON ]]; then
  echo "not found package.json at: "$PACKAGE_JSON;
  exit -1;
fi;

gsed -i -E 's|(.*)"version": "([0-9]+)\.([0-9]+)\.([0-9]+)"|echo "\1\\"version\\": \\"\2.\3.$((\4+1))\\""|e' $PACKAGE_JSON

echo "auto updated version"

say build ok
