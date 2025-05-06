#!/bin/bash

SESSION="geth2"
DATADIR="./gethdata2"
PASSWORD_FILE="password2.txt"
GETH_LOG="geth2.log"

# create a new account if needed
if [ ! -d "$DATADIR/geth" ]; then
  mkdir -p $DATADIR
  geth --datadir $DATADIR account new --password $PASSWORD_FILE
fi

# check if tmux session already exists
if tmux has-session -t $SESSION 2>/dev/null; then
  exit 0
fi

# start new tmux session and run geth2 inside it

tmux new-session -d -s $SESSION "geth --datadir $DATADIR \
  --networkid 9412 \
  --http --http.addr 0.0.0.0 --http.port 8547 \
  --http.api eth,net,web3,clique,admin \
  --port 30306 \
  --discovery.port 30305 \
  --allow-insecure-unlock \
  2>&1 | tee $GETH_LOG"

echo "tmux attach -t $SESSION"
