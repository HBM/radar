
export PATH := ./node_modules/.bin:$(PATH)


# JS
#
css:
	./node_modules/.bin/node-sass ./css/index.scss ./debug/css/styles.css
	./node_modules/.bin/node-sass --watch ./css/index.scss ./debug/css/styles.css

react:
	mkdir -p debug/js
	mkdir -p debug/css
	mkdir -p debug/fonts
	NODE_ENV=development node ./html/compile.js
	cp -r fonts/* debug/fonts/
	./node_modules/.bin/node-sass ./css/index.scss ./debug/css/styles.css
	$(RM) ./debug/js/script.js
	./node_modules/.bin/watchify --outfile ./debug/js/script.js -t babelify --verbose --debug ./src/index.js

build:
	mkdir -p prod/js
	mkdir -p prod/css
	mkdir -p prod/fonts
	cp -r fonts/* prod/fonts/
	# create index.html with paths to min js and css
	NODE_ENV=production node ./html/compile.js
	# minify css
	./node_modules/.bin/node-sass --style compressed ./css/index.scss ./prod/css/styles.min.css
	$(RM) ./prod/js/script.min.*
	@NODE_ENV=production \
	browserify ./src/index.js \
	-t babelify \
	-t [envify] \
	| uglifyjs --compress --mangle > ./prod/js/script.min.js 2>/dev/null
	echo "Build Done!"

server-debug:
	http-server -p 6001 ./debug

server-release:
	http-server -p 6002 ./prod


# Phony commands
.PHONY: react build server-debug server-release css
