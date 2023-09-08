#!/bin/bash

cd build
./build.sh
./build.backend.docker.sh
cd ..
yarn build

