#!/bin/bash

SESSION="erigon"
DATADIR="./erigondata"
GENESIS_FILE="./genesis.json"
JWT_SECRET="./jwt.hex"
LOG_FILE="erigon.log"
ERIGON_BIN="/home/blockchain/erigon/build/bin/erigon"

# create jwt secret if needed
if [ ! -f "$JWT_SECRET" ]; then
  openssl rand -hex 32 > "$JWT_SECRET"
fi

# initialize erigon with genesis if not already initialized
if [ ! -d "$DATADIR/chaindata" ]; then
  $ERIGON_BIN init --datadir $DATADIR $GENESIS_FILE
fi

# check if tmux session already exists
if tmux has-session -t $SESSION 2>/dev/null; then
  exit 0
fi

# launch erigon in tmux
tmux new-session -d -s $SESSION "$ERIGON_BIN --datadir $DATADIR \
  --networkid 9412 \
  --http --http.addr 0.0.0.0 --http.port 8545 \
  --http.api eth,web3,net,clique \
  --authrpc.addr 0.0.0.0 \
  --authrpc.port 8551 \
  --authrpc.vhosts=* \
  --authrpc.jwtsecret=$JWT_SECRET \
  --externalcl \
  --metrics 2>&1 | tee $LOG_FILE"

echo "tmux attach -t $SESSION"
