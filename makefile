BUILD_DIR := build/
SRC_DIR := src/

# Function to make changing the document root easier
changeroot = $(shell python3 helpers/changeroot.py $(1) $(2))


#### Get list of src files
### css/
## *.css
CSS_SRC_DIR := $(SRC_DIR)css/
CSS_SRC_FILES := $(shell find $(CSS_SRC_DIR) -type f -iname '*.css')
CSS_BUILD_FILES := $(call changeroot,$(BUILD_DIR),$(CSS_SRC_FILES))

# Copy .css files to the build directory
$(CSS_BUILD_FILES): $(CSS_SRC_FILES)
	mkdir -p $(dir $@)
	cp $(call changeroot,$(SRC_DIR),$@) $@


## *.scss | *.sass
SASS_SRC_DIR := $(SRC_DIR)css/
SASS_SRC_FILES := $(shell find $(SASS_SRC_DIR) -type f \( -iname \*.scss -o -iname \*.sass \))
SASS_BUILD_FILES := $(call changeroot,$(BUILD_DIR),$(SASS_SRC_FILES))

# Compile .scss or .sass files into .css files in the build directory
$(SASS_BUILD_FILES): $(SASS_SRC_FILES)
	mkdir -p $(dir $@)
	node_modules/sass/sass.js $(call changeroot,$(SRC_DIR),$@) $@

### html/
## *.html
HTML_SRC_DIR := $(SRC_DIR)html/
HTML_SRC_FILES := $(shell find $(HTML_SRC_DIR) -type f -iname '*.html')
HTML_BUILD_FILES := $(call changeroot,$(BUILD_DIR),$(HTML_SRC_FILES))

# Copy .html files to the build directory
$(HTML_BUILD_FILES): $(HTML_SRC_FILES)
	mkdir -p $(dir $@)
	cp $(call changeroot,$(SRC_DIR),$@) $@


## *.ejs
EJS_SRC_DIR := $(SRC_DIR)html/
EJS_SRC_FILES := $(shell find $(EJS_SRC_DIR) -type f -iname '*.ejs')
EJS_BUILD_FILES := $(call changeroot,$(BUILD_DIR),$(EJS_SRC_FILES:.ejs=.html))

# Compile .ejs files to .html files in the build directory
$(EJS_BUILD_FILES): $(EJS_SRC_FILES)
	mkdir -p $(dir $@)
	node helpers/ejs.js $(call changeroot,$(SRC_DIR),$(basename $@).ejs) > $@


### js/
## *.js
JS_SRC_DIR := $(SRC_DIR)js/
JS_SRC_FILES := $(shell find $(JS_SRC_DIR) -type f -iname '*.js')
JS_BUILD_FILES := $(call changeroot,$(BUILD_DIR),$(JS_SRC_FILES))

# Copy .js files to the build directory
$(JS_BUILD_FILES): $(JS_SRC_FILES)
	mkdir -p $(dir $@)
	cp $(call changeroot,$(SRC_DIR),$@) $@


## *.coffee
COFFEE_SRC_DIR := $(SRC_DIR)js/
COFFEE_SRC_FILES := $(shell find $(COFFEE_SRC_DIR) -type f -iname '*.coffee')
COFFEE_BUILD_FILES := $(call changeroot,$(BUILD_DIR),$(COFFEE_SRC_FILES:.coffee=.js))

# Compile .coffee files to .js files in the build directory
$(COFFEE_BUILD_FILES): $(COFFEE_SRC_FILES)
	mkdir -p $(dir $@)
	cat $(call changeroot,$(SRC_DIR),$(basename $@).coffee) | node_modules/coffeescript/bin/coffee -sc > $@


### server/html
## server/*.html
SERVER_HTML_SRC_DIR := $(SRC_DIR)server/ejs/
SERVER_HTML_SRC_FILES := $(shell find $(SERVER_HTML_SRC_DIR) -type f -iname '*.html')
SERVER_HTML_BUILD_FILES := $(call changeroot,$(BUILD_DIR),$(SERVER_HTML_SRC_FILES))

# Copy server .html files to the build directory
$(SERVER_HTML_BUILD_FILES): $(SERVER_HTML_SRC_FILES)
	mkdir -p $(dir $@)
	cp $(call changeroot,$(SRC_DIR),$@) $@


## server/*.ejs
SERVER_EJS_SRC_DIR := $(SRC_DIR)server/ejs/
SERVER_EJS_SRC_FILES := $(shell find $(SERVER_EJS_SRC_DIR) -type f -iname '*.ejs')
SERVER_EJS_BUILD_FILES := $(call changeroot,$(BUILD_DIR),$(SERVER_EJS_SRC_FILES))

# Copy server .ejs files to the build directory
$(SERVER_EJS_BUILD_FILES): $(SERVER_EJS_SRC_FILES)
	mkdir -p $(dir $@)
	cp $(call changeroot,$(SRC_DIR),$@) $@


### server/js
## server/*.js
SERVER_JS_SRC_DIR := $(SRC_DIR)server/js/
SERVER_JS_SRC_FILES := $(shell find $(SERVER_JS_SRC_DIR) -type f -iname '*.js')
SERVER_JS_BUILD_FILES := $(call changeroot,$(BUILD_DIR),$(SERVER_JS_SRC_FILES))

# Copy server .js files to the build directory
$(SERVER_JS_BUILD_FILES): $(SERVER_JS_SRC_FILES)
	mkdir -p $(dir $@)
	cp $(call changeroot,$(SRC_DIR),$@) $@


## server/*.coffee
SERVER_COFFEE_SRC_DIR := $(SRC_DIR)server/js/
SERVER_COFFEE_SRC_FILES := $(shell find $(SERVER_COFFEE_SRC_DIR) -type f -iname '*.coffee')
SERVER_COFFEE_BUILD_FILES := $(call changeroot,$(BUILD_DIR),$(SERVER_COFFEE_SRC_FILES:.coffee=.js))

# Compile server .coffee files to .js files in the build directory
$(SERVER_COFFEE_BUILD_FILES): $(SERVER_COFFEE_SRC_FILES)
	mkdir -p $(dir $@)
	cat $(call changeroot,$(SRC_DIR),$(basename $@).coffee) | node_modules/coffeescript/bin/coffee -sc > $@


### static/
## *
STATIC_SRC_DIR := $(SRC_DIR)/static/
STATIC_SRC_FILES := $(shell find $(STATIC_SRC_DIR) -type f)
STATIC_BUILD_FILES := $(call changeroot,$(BUILD_DIR),$(STATIC_SRC_FILES))

# Copy all files to the build directory
$(STATIC_BUILD_FILES): $(STATIC_SRC_FILES)
	mkdir -p $(dir $@)
	cp $(call changeroot,$(SRC_DIR),$@) $@

### Special Rules
all: html css js serverjs serverhtml static

html: $(HTML_BUILD_FILES) $(EJS_BUILD_FILES)

css: $(CSS_BUILD_FILES) $(SASS_BUILD_FILES)

js: $(JS_BUILD_FILES) $(COFFEE_BUILD_FILES)

serverjs: $(SERVER_JS_BUILD_FILES) $(SERVER_COFFEE_BUILD_FILES)

serverhtml: $(SERVER_EJS_BUILD_FILES) $(SERVER_HTML_BUILD_FILES)

static: $(STATIC_BUILD_FILES)


clean:
	rm -rf $(BUILD_DIR)

.PHONY: all clean html css js serverjs serverhtml static
.DEFAULT_GOAL := all

