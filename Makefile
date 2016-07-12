
export PATH := ./node_modules/.bin:$(PATH)

# JS
react:
	$(RM) js/script.min.js
	./node_modules/.bin/watchify --outfile ./js/script.js -t babelify --verbose --debug ./js/src/index.js

build:
	@NODE_ENV=production \
	browserify ./js/src/index.js \
	-t babelify \
	-t [envify] \
	| uglifyjs --compress --mangle > ./js/script.min.js

server:
	python -m SimpleHTTPServer 6001


# Phony commands
.PHONY: react build server
