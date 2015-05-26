#!/usr/bin/env sh
find ./js -name "*.js*" | grep -v node_modules | xargs node_modules/.bin/js-beautify -j -r -t --good-stuff --e4x
