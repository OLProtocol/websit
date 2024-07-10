#!/bin/bash
set -x
# set -e
git checkout main && git pull && rm -rf dist && git add . && git commit -m "fix" && git push
git checkout test && git pull && rm -rf dist && git add . && git commit -m "fix"
git merge main && npm run build:test && git add . && git commit -m "fix" && git push
git checkout dev && git pull && git merge main && npm run build:dev && git add . && git commit -m "fix" && git push
git checkout main && npm run build:prod && git add . && git commit -m "fix" && git push
