BUILD_DIR := build/
SRC_DIR := src/

# Doesn't store a value, just used to execute shell command on run
EXECUTE_ONCE := $(shell mkdir -p $(BUILD_DIR); cp -r $(SRC_DIR)* $(BUILD_DIR))

# List of source files
SRC_FILES := $(shell find $(BUILD_DIR) -type f)

# Get EJS
EJS_SRC_FILES := $(filter %.ejs, $(SRC_FILES))
EJS_DEST_FILES := $(EJS_SRC_FILES:.ejs=.ejs.html)

all: ejs;

ejs: $(EJS_DEST_FILES);

# Compile .ejs files into .ejs.html
$(EJS_DEST_FILES): $(filter-out %.ejs.html, $(filter %.html %.ejs, $(SRC_FILES)))
	node_modules/ejs-cli/bin/ejs-cli $(basename $@) > $@
	rm $(basename $@)

clean:
	rm -r build/

.PHONY: all ejs clean
