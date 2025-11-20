#!/bin/sh
mkdir -p ./dist/templates/full
mkdir -p ./dist/templates/minimal
cp -r ./templates/full/* ./dist/templates/full/
cp -r ./templates/minimal/* ./dist/templates/minimal/
