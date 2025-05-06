#!/bin/bash

sudo killall geth
sudo killall erigon

sudo lsof -i :8545
sudo lsof -i :8546
sudo lsof -i :8547
sudo lsof -i :30303
sudo lsof -i :30304
sudo lsof -i :30305

sleep 2

./start-erigon.sh
sleep 2

./start-geth.sh
sleep 2

./start-babygeth.sh
sleep 2

echo "tmux attach -t erigon"
echo "tmux attach -t geth"
echo "tmux attach -t babygeth"
