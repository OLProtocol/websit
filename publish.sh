#!/bin/bash
set -x
# set -e

git checkout main && git pull && rm -rf dist && git add . && git commit -m "publish: clean main dist"
git checkout app && git pull && rm -rf dist && git add . && git commit -m "publish: clean app dist"
git checkout app.testnet4 && git pull && rm -rf dist && git add . && git commit -m "publish: clean app.testnet4 dist"
git checkout test && git pull && rm -rf dist && git add . && git commit -m "publish: clean test dist"
git checkout test.testnet4 && git pull && rm -rf dist && git add . && git commit -m "publish: clean test.testnet4 dist"
git checkout dev && git pull && rm -rf dist && git add . && git commit -m "publish: clean dev dist"
git checkout dev.testnet4 && git pull && rm -rf dist && git add . && git commit -m "publish: clean dev.testnet4 dist"

git checkout app && git merge main --no-edit && yarn build:app && git add . && git commit -m "publish: generate app dist" && git push origin app
git checkout app.testnet4 && git merge main --no-edit && yarn build:app.testnet4 && git add . && git commit -m "publish: generate app.testnet4 dist" && git push origin app.testnet4
git checkout test && git merge main --no-edit && yarn build:test && git add . && git commit -m "publish: generate test dist" && git push origin test
git checkout test.testnet4 && git merge main --no-edit && yarn build:test.testnet4 && git add . && git commit -m "publish: generate test.testnet4 dist" && git push origin test.testnet4
git checkout dev && git merge main --no-edit && yarn build:dev && git add . && git commit -m "publish: generate dev dist" && git push origin dev
git checkout dev.testnet4 && git merge main --no-edit && yarn build:dev.testnet4 && git add . && git commit -m "publish: generate dev.testnet4 dist" && git push origin dev.testnet4

# git checkout main && yarn build:app && git add . && git commit -m "publish: generate prd dist" && git push
