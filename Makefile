
# Binaries
myth = ./node_modules/.bin/myth
csslint = ./node_modules/.bin/csslint
watchify = ./node_modules/.bin/watchify
browserify = ./node_modules/.bin/browserify
uglifyjs = ./node_modules/.bin/uglifyjs
eslint = ./node_modules/.bin/eslint
jest = ./node_modules/.bin/jest

# Rules for csslint
RULES = box-sizing,box-model,universal-selector,unqualified-attributes,compatible-vendor-prefixes,outline-none,adjoining-classes,font-sizes,fallback-colors

# CSS
css:
	$(myth) -v ./css/src/index.css ./css/styles.css

cssmin:
	$(myth) -c -v ./css/src/index.css ./css/styles.min.css

csslint:
	$(csslint) --ignore=$(RULES) ./css/styles.css

# JS
react:
	$(RM) js/script.min.js
	$(watchify) --outfile ./js/script.js -t babelify --verbose --debug ./js/src/index.js

build:
	$(browserify) ./js/src/index.js \
	-t babelify \
	-t [envify --NODE_ENV production] \
	| $(uglifyjs) --compress --mangle > ./js/script.min.js

lint:
	$(eslint) ./js/src

server:
	python -m SimpleHTTPServer 6001

test:
	$(jest)

# Phony commands
.PHONY: css cssmin csslint react build lint server test
