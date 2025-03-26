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

# CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
# if [ "$CURRENT_BRANCH" != "main" ]; then
#     echo "当前分支不是 main，请切换到 main 分支后再运行脚本"
#     exit 1
# fi

# check_version() {
#     URL=$1
#     while true; do
#         RESPONSE=$(curl -s "$URL")
#         if [ "$RESPONSE" == "$NEW_VERSION1" ]; then
#             echo "version matched: $RESPONSE"
#             break
#         else
#             echo "mismatch: $RESPONSE，sleep 5..."
#             sleep 5
#         fi
#     done
# }

# git fetch --all
# git add . && git commit -m "publish: update" && git push
# git checkout app && git pull && git merge -X theirs main --no-edit && yarn build:app && git add . && git commit -m "publish: generate app dist" && git push origin app
# # check_version "https://app.sat20.org/version.txt"
# git checkout app.testnet4 && git pull && git merge -X theirs main --no-edit && yarn build:app.testnet4 && git add . && git commit -m "publish: generate app.testnet4 dist" && git push origin app.testnet4
# # check_version "https://app.testnet4.sat20.org/version.txt"
# git checkout test && git pull && git merge -X theirs main --no-edit && yarn build:test && git add . && git commit -m "publish: generate test dist" && git push origin test
# # check_version "https://test.sat20.org/version.txt"
# git checkout test.testnet4 && git pull && git merge -X theirs main --no-edit && yarn build:test.testnet4 && git add . && git commit -m "publish: generate test.testnet4 dist" && git push origin test.testnet4
# # check_version "https://test.testnet4.sat20.org/version.txt"
# git checkout dev && git pull && git merge -X theirs main --no-edit && yarn build:dev && git add . && git commit -m "publish: generate dev dist" && git push origin dev
# # check_version "https://dev.sat20.org/version.txt"
# git checkout dev.testnet4 && git pull && git merge -X theirs main --no-edit && yarn build:dev.testnet4 && git add . && git commit -m "publish: generate dev.testnet4 dist" && git push origin dev.testnet4
# # check_version "https://dev.testnet4.sat20.org/version.txt"

# VERSION_FILE1="src/assets/version.txt"
# VERSION_FILE2="public/version.txt"
# VERSION1=$(cat "$VERSION_FILE1")
# VERSION2=$(cat "$VERSION_FILE2")
# NEW_VERSION1=$((VERSION1 + 1))
# NEW_VERSION2=$((VERSION2 + 1))
# git checkout main && printf "%s" "$NEW_VERSION1" >"$VERSION_FILE1" && printf "%s" "$NEW_VERSION2" >"$VERSION_FILE2" && git add . && git commit -m "publish: add version for next publish" && git push
# # git checkout main && yarn build:app && git add . && git commit -m "publish: generate prd dist" && git push

npm run build:app.testnet
scp -r dist/. root@103.103.245.177:/var/www/testnet.sat20.org/browser/app/

npm run build:app
scp -r dist/. root@103.103.245.177:/var/www/mainnet.sat20.org/browser/app/

git add . && git commit -m "add version" && git push -u origin main