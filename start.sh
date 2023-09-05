#!/bin/bash
cd packages/client
yarn start-prod &
cd ../editor
yarn start-prod &
cd ../login
yarn start-prod &
