#!/bin/bash

npm run build:grida
scp -r -P 65535 ./dist/ aifrica@110.45.179.14:/home/aifrica/grida.ui
