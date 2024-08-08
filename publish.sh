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

git checkout app && git merge main --no-edit && npm run build:app && git add . && git commit -m "publish: generate app dist" && git push
git checkout app.testnet4 && git merge main --no-edit && npm run build:app.testnet4 && git add . && git commit -m "publish: generate app.testnet4 dist" && git push
git checkout test && git merge main --no-edit && npm run build:test && git add . && git commit -m "publish: generate test dist" && git push
git checkout test.testnet4 && git merge main --no-edit && npm run build:test.testnet4 && git add . && git commit -m "publish: generate test.testnet4 dist" && git push
git checkout dev && git merge main --no-edit && npm run build:dev && git add . && git commit -m "publish: generate dev dist" && git push
git checkout dev.testnet4 && git merge main --no-edit && npm run build:dev.testnet4 && git add . && git commit -m "publish: generate dev.testnet4 dist" && git push

# git checkout main && npm run build:app && git add . && git commit -m "publish: generate prd dist" && git push
