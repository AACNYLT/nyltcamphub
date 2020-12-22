#!/bin/bash

echo "Starting build..."
rm -rf ./build
npm install
npm run build
echo "Built Node app"
ls
cd ./static
echo "Inside ./static"
npm install
npm run build
echo "Built React App"
mv ./build/* ../build/static