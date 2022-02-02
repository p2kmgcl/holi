#!/bin/bash

rm -rf ./build
mkdir -p ./build

rm ./manifest.json
cp ./manifest.firefox.json ./manifest.json
zip -r build/holi-firefox.zip _locales assets dependencies src LICENSE manifest.json

rm ./manifest.json
cp ./manifest.chrome.json ./manifest.json
zip -r build/holi-chrome.zip _locales assets dependencies src LICENSE manifest.json
