#!/bin/bash

set -e

ganache-cli 2> /dev/null 1> /dev/null &
sleep 5 # to make sure ganache-cli is up and running before compiling
rm -rf build
cd smart-contract
npm install chai chai-bignumber ethereumjs-util ethjs-abi web3-utils --save
truffle compile
truffle migrate --reset --network development
truffle test
export COVERALLS_REPO_TOKEN=OxKTQG4wUtAUjkjEF8C1hIsUGH5tLtPz2
npm run coverage && cat coverage/lcov.info | coveralls

kill -9 $(lsof -t -i:8545)
