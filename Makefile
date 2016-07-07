
export PATH := ./node_modules/.bin:$(PATH)

# JS
react:
	$(RM) js/script.min.js
	./node_modules/.bin/watchify --outfile ./js/script.js -t babelify --verbose --debug ./js/src/index.js

build:
	browserify ./js/src/index.js \
	-t babelify \
	-t [envify --NODE_ENV production] \
	| uglifyjs --compress --mangle > ./js/script.min.js

server:
	python -m SimpleHTTPServer 6001


# Phony commands
.PHONY: react build server
