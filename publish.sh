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

VERSION_FILE1="src/assets/version.txt"
VERSION_FILE2="public/version.txt"
VERSION1=$(cat "$VERSION_FILE1")
VERSION2=$(cat "$VERSION_FILE2")
NEW_VERSION1=$((VERSION1 + 1))
NEW_VERSION2=$((VERSION2 + 1))

check_version() {
    URL=$1
    while true; do
        RESPONSE=$(curl -s "$URL")
        if [ "$RESPONSE" == "$NEW_VERSION1" ]; then
            echo "版本号匹配: $RESPONSE"
            break
        else
            echo "版本号不匹配: $RESPONSE，等待 5 秒后重试..."
            sleep 5
        fi
    done
}

git checkout app && git merge main --no-edit && yarn build:app && git add . && git commit -m "publish: generate app dist" && git push origin app
check_version "https://app.sat20.org/version.txt"
git checkout app.testnet4 && git merge main --no-edit && yarn build:app.testnet4 && git add . && git commit -m "publish: generate app.testnet4 dist" && git push origin app.testnet4
check_version "https://app.testnet4.sat20.org/version.txt"
git checkout test && git merge main --no-edit && yarn build:test && git add . && git commit -m "publish: generate test dist" && git push origin test
check_version "https://test.sat20.org/version.txt"
git checkout test.testnet4 && git merge main --no-edit && yarn build:test.testnet4 && git add . && git commit -m "publish: generate test.testnet4 dist" && git push origin test.testnet4
check_version "https://test.testnet4.sat20.org/version.txt"
git checkout dev && git merge main --no-edit && yarn build:dev && git add . && git commit -m "publish: generate dev dist" && git push origin dev
check_version "https://dev.sat20.org/version.txt"
git checkout dev.testnet4 && git merge main --no-edit && yarn build:dev.testnet4 && git add . && git commit -m "publish: generate dev.testnet4 dist" && git push origin dev.testnet4
check_version "https://dev.testnet4.sat20.org/version.txt"

git checkout main && echo "$NEW_VERSION1" >"$VERSION_FILE1" && echo "$NEW_VERSION2" >"$VERSION_FILE2" && git add . && git commit -m "publish: add version for next publish" && git push
# git checkout main && yarn build:app && git add . && git commit -m "publish: generate prd dist" && git push
