#!/bin/bash

cd build
./build.sh
./build.backend.docker.sh
PROXY_ID=$(docker ps|grep proxy| awk '{print $1}')
docker stop $PROXY_ID
docker rm $PROXY_ID
cd install/docker
docker-compose -f /home/james/DocSpace/build/install/docker/james.yml up -d
cd /home/james/DocSpace
yarn build

