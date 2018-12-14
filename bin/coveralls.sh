#!/bin/bash

npm run coverage && cat coverage/lcov.info | coveralls

kill -9 $(lsof -t -i:8545)
