#!/bin/bash

SESSION="geth"
DATADIR="./gethdata"
PASSWORD_FILE="password.txt"
GETH_LOG="geth.log"

# signer address in lowercase
SIGNER="0xf0838e595a43a146048b9b7b8c560f481cdab637"

# check if tmux session already exists
if tmux has-session -t $SESSION 2>/dev/null; then
  exit 0
fi

# start new tmux session and run geth inside it

tmux new-session -d -s $SESSION "geth --datadir $DATADIR \
  --networkid 9412 \
  --http --http.addr 0.0.0.0 --http.port 8546 \
  --http.api eth,net,web3,clique,admin,personal,miner \
  --mine \
  --miner.etherbase=$SIGNER \
  --unlock $SIGNER \
  --password $PASSWORD_FILE \
  --port 30303 \
  2>&1 | tee $GETH_LOG"

echo "tmux attach -t $SESSION"
