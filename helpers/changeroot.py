#! /usr/bin/env python3

import argparse
from pathlib import PurePath

parser = argparse.ArgumentParser(description="This is a helper script intended to be used by the makefile and should not be called directly.")
parser.add_argument("dest", help="Directory to substitute the root of the following paths")
parser.add_argument("paths", nargs='*', help="List of file paths that need to have their root directory substituted")
args = parser.parse_args()


new_paths = ""
for path in args.paths:
    path = PurePath(path)
    path = PurePath(args.dest, *path.parts[1:])
    new_paths += str(path) + " "

print(new_paths[:-1])
