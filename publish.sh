#!/bin/bash
set -x
# set -e
git checkout main && git pull && rm -rf dist && git add . && git commit -m "publish: clean main dist"
git checkout test && git pull && rm -rf dist && git add . && git commit -m "publish: clean test dist"
git checkout dev && git pull && rm -rf dist && git add . && git commit -m "publish: clean dev dist"

git checkout test && git merge main --no-edit && npm run build:test && git add . && git commit -m "publish: generate test dist" && git push
git checkout dev && git merge main --no-edit && npm run build:dev && git add . && git commit -m "publish: generate dev dist" && git push
git checkout main && npm run build:prod && git add . && git commit -m "publish: generate prd dist" && git push
