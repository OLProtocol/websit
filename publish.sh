#!/bin/bash
set -x
# set -e

# git checkout main && git pull && rm -rf dist && git add . && git commit -m "publish: clean main dist"
# git checkout app && git pull && rm -rf dist && git add . && git commit -m "publish: clean app dist"
# git checkout app.testnet4 && git pull && rm -rf dist && git add . && git commit -m "publish: clean app.testnet4 dist"
# git checkout test && git pull && rm -rf dist && git add . && git commit -m "publish: clean test dist"
# git checkout test.testnet4 && git pull && rm -rf dist && git add . && git commit -m "publish: clean test.testnet4 dist"
# git checkout dev && git pull && rm -rf dist && git add . && git commit -m "publish: clean dev dist"
# git checkout dev.testnet4 && git pull && rm -rf dist && git add . && git commit -m "publish: clean dev.testnet4 dist"

git checkout app && git merge main --no-edit && yarn build:app && git add . && git commit -m "publish: generate app dist" && git push origin app
git checkout app.testnet4 && git merge main --no-edit && yarn build:app.testnet4 && git add . && git commit -m "publish: generate app.testnet4 dist" && git push origin app.testnet4
git checkout test && git merge main --no-edit && yarn build:test && git add . && git commit -m "publish: generate test dist" && git push origin test
git checkout test.testnet4 && git merge main --no-edit && yarn build:test.testnet4 && git add . && git commit -m "publish: generate test.testnet4 dist" && git push origin test.testnet4
git checkout dev && git merge main --no-edit && yarn build:dev && git add . && git commit -m "publish: generate dev dist" && git push origin dev
git checkout dev.testnet4 && git merge main --no-edit && yarn build:dev.testnet4 && git add . && git commit -m "publish: generate dev.testnet4 dist" && git push origin dev.testnet4

VERSION_FILE1="src/assets/version.txt"
VERSION_FILE2="public/version.txt"
VERSION1=$(cat "$VERSION_FILE1")
VERSION2=$(cat "$VERSION_FILE2")
NEW_VERSION1=$((VERSION1 + 1))
NEW_VERSION2=$((VERSION2 + 1))
git checkout main && echo "$NEW_VERSION1" >"$VERSION_FILE1" && echo "$NEW_VERSION2" >"$VERSION_FILE2" && git add . && git commit -m "publish: add version for next publish" && git push
# git checkout main && yarn build:app && git add . && git commit -m "publish: generate prd dist" && git push
