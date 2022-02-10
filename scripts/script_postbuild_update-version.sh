gsed -i -E 's|(.*)"version": "([0-9]+)\.([0-9]+)\.([0-9]+)"|echo "\1\\"version\\": \\"\2.\3.$((\4+1))\\""|e' release/app/package.json
echo "auto updated version"
say build ok
