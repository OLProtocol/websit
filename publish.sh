#!/bin/bash
# set -x
set -e

git pull && git add . && git commit -m "fix" && git push
