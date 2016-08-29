
export PATH := ./node_modules/.bin:$(PATH)


# JS
#
css:
	./node_modules/.bin/node-sass ./css/index.scss ./debug/css/styles.css
	./node_modules/.bin/node-sass --watch ./css/index.scss ./debug/css/styles.css

react:
	mkdir -p debug/{js,css,fonts}
	NODE_ENV=development node ./html/compile.js
	cp -r fonts/* debug/fonts/
	./node_modules/.bin/node-sass ./css/index.scss ./debug/css/styles.css
	$(RM) ./debug/js/script.js
	./node_modules/.bin/watchify --outfile ./debug/js/script.js -t babelify --verbose --debug ./src/index.js

build:
	mkdir -p prod/{js,css}
	# create index.html with paths to min js and css
	npm i
	NODE_ENV=production node ./html/compile.js
	# minify css
	./node_modules/.bin/node-sass --style compressed ./css/index.scss ./prod/css/styles.min.css
	$(RM) ./prod/script.min.*
	@NODE_ENV=production \
	./node_modules/.bin/browserify ./src/index.js \
	-t babelify \
	| ./node_modules/.bin/uglifyjs --compress --mangle > ./prod/script.min.js 2>/dev/null
	echo "Build Done!"
	gzip < ./prod/script.min.js > ./prod/script.min.js.gz
	du -h ./prod/script.min.*

server-debug:
	http-server -p 6001 ./debug

server-release:
	http-server -p 6002 ./prod


# Phony commands
.PHONY: react build server-debug server-release css
