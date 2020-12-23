#!/bin/bash

echo "Starting build..."
rm -rf ./build
npm install
npm run compile
echo "Built Node app"
ls
echo "Copying media..."
mkdir ./build/media
mv ./media/* ./build/media
cd ./static
echo "Inside ./static"
npm install
npm run build
echo "Built React App"
mv ./build/* ../build/static