library_input := src/lib/index.js
library_output := dist/js/library.js
library_output_min := dist/js/library.min.js

odette_input := src/lib/odette/index.js
odette_output := dist/js/odette.js
odette_output_min := dist/js/odette.min.js


startup_input := src/lib/application.js
startup_output := dist/js/startup.js
startup_output_min := dist/js/startup.min.js


fresh: clean build_all


ensure_folder:
	mkdir -p dist

ensure_build_js: ensure_folder
	mkdir dist/js

build_all: ensure_build_js build_library build_odette build_startup


build_library:
	browserify $(library_input) -o $(library_output)
	uglifyjs $(library_output) > $(library_output_min)

build_odette:
	browserify $(odette_input) -o $(odette_output)
	uglifyjs $(odette_output) > $(odette_output_min)

build_startup:
	browserify $(startup_input) -o $(startup_output)
	uglifyjs $(startup_output) > $(startup_output_min)

clean:
	rm -rf dist


