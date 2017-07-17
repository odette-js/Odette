dist := dist/

src := src/

static := src/static/

library_input := src/lib/node_modules/library.js
library_output := dist/js/library.js
library_output_min := dist/js/library.min.js

odette_input := src/lib/node_modules/odette.js
odette_output := dist/js/odette.js
odette_output_min := dist/js/odette.min.js

startup_input := src/lib/node_modules/startup.js
startup_output := dist/js/startup.js
startup_output_min := dist/js/startup.min.js

spec_input := src/lib/node_modules/spec.js
spec_output := dist/js/spec.js
spec_output_min := dist/js/spec.min.js

fresh: clean build_all

ensure_folder:
	mkdir -p dist

ensure_build_js: ensure_folder
	mkdir -p dist/js

build_all: copy_static ensure_build_js build_library build_odette build_startup build_spec

copy_static:
	cp -r $(static) $(dist)

build_library:
	browserify $(library_input) > $(library_output)
	# uglifyjs $(library_output) > $(library_output_min)

build_spec:
	browserify $(spec_input) > $(spec_output)
	# uglifyjs $(spec_output) > $(spec_output_min)

build_odette:
	browserify $(odette_input) > $(odette_output)
	# uglifyjs $(odette_output) > $(odette_output_min)

build_startup:
	browserify $(startup_input) > $(startup_output)
	# uglifyjs $(startup_output) > $(startup_output_min)

clean:
	rm -rf dist

