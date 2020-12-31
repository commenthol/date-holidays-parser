#!/bin/bash

cwd=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

dirs=(
  hebrew-calendar
  hijri-calendar
)

function run () {
  cd "$cwd/$1"
  test -d node_modules && rm -rf node_modules
  npm i && npm start
}

for dir in "${dirs[@]}"
do
  run "$dir"
done
