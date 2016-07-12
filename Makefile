
export PATH := ./node_modules/.bin:$(PATH)

# JS
react:
	$(RM) js/script.min.js
	./node_modules/.bin/watchify --outfile ./debug/script.js -t babelify --verbose --debug ./js/src/index.js

build:
	$(RM) ./prod/script.min.*
	@NODE_ENV=production \
	browserify ./js/src/index.js \
	-t babelify \
	-t [envify] \
	| uglifyjs --compress --mangle > ./prod/script.min.js 2>/dev/null
	echo "Build Done!"
	gzip -k ./prod/script.min.js
	du -h ./prod/script.min.*

server-debug:
	http-server -p 6001 ./debug

server-release:
	http-server -p 6002 ./prod


# Phony commands
.PHONY: react build server-debug server-release
