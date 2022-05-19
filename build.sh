#!/usr/bin/env bash
export BUILD_PLATFORM=linux
export CI=true

if [ -n "$http_proxy" ]; then
    export ELECTRON_GET_USE_PROXY=1
    export GLOBAL_AGENT_HTTP_PROXY="${http_proxy}"
    export GLOBAL_AGENT_HTTPS_PROXY="${http_proxy}"
  fi

# Cleanup
rm -rf build dist out node_modules

# Install Git
apt update
apt install git -y

# Install node
curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh

# Install modules
npm ci

# Setting NODE_ENV
export NODE_ENV=production 

# Compile ReactJS
BUILD_PATH=./build npx react-scripts build

# Compile ElectronJS
npx tsc --project tsconfig.app.json

# Merge builds
mv build dist/app

# Build App
npx electron-forge package --platform linux

# Rearrange folders
cp -rv "$SNAPCRAFT_PART_BUILD"/out/Bluedis-* "$SNAPCRAFT_PART_INSTALL"
mv "$SNAPCRAFT_PART_INSTALL"/Bluedis-* "$SNAPCRAFT_PART_INSTALL"/bin