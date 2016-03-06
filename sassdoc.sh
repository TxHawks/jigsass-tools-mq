#!/bin/sh
# Generate documentation and deploy it to GitHub pages
# http://TxHawks.github.io/jigsass-tools-mq/
gulp sass:doc
git add ./sassdoc
git commit -m "Compile SassDoc"
git subtree push --prefix sassdoc origin gh-pages
