#!/bin/bash

# lowercase address for compatibility
SIGNER="0xf0838e595a43a146048b9b7b8c560f481cdab637"
CHAIN_ID=9412
GENESIS_FILE="genesis.json"
GETH_DIR="./gethdata"
ERIGON_DIR="./erigondata"
PASSWORD_FILE="./password.txt"
JWT_SECRET="./jwt.hex"

# create password file if missing
if [ ! -f "$PASSWORD_FILE" ]; then
  echo "" > "$PASSWORD_FILE"
fi

# create dummy jwt secret if needed
if [ ! -f "$JWT_SECRET" ]; then
  openssl rand -hex 32 > "$JWT_SECRET"
fi

# create genesis if missing
if [ ! -f "$GENESIS_FILE" ]; then
  cat > "$GENESIS_FILE" <<EOF
{
  "config": {
    "chainId": $CHAIN_ID,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "clique": {
      "period": 5,
      "epoch": 30000
    }
  },
  "difficulty": "1",
  "gasLimit": "8000000",
  "extradata": "0x0000000000000000000000000000000000000000000000000000000000000000f0838e595a43a146048b9b7b8c560f481cdab637000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "alloc": {},
  "coinbase": "0x0000000000000000000000000000000000000000",
  "nonce": "0x0",
  "timestamp": "0x0",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "number": "0x0",
  "gasUsed": "0x0"
}
EOF
fi

# initialize geth once
if [ ! -d "$GETH_DIR/geth/chaindata" ]; then
  geth --datadir "$GETH_DIR" init "$GENESIS_FILE"
fi

# start geth
nohup geth --datadir "$GETH_DIR" \
  --networkid $CHAIN_ID \
  --http --http.addr "0.0.0.0" --http.port 8545 \
  --http.api "eth,net,web3,clique,personal" \
  --mine --miner.etherbase="$SIGNER" \
  --unlock "$SIGNER" \
  --password "$PASSWORD_FILE" \
  --nodiscover \
  > geth.log 2>&1 &

# start erigon
nohup erigon --datadir "$ERIGON_DIR" \
  --chain "$GENESIS_FILE" \
  --networkid $CHAIN_ID \
  --http \
  --http.api=eth,web3,net \
  --externalcl \
  --clique \
  --authrpc.jwtsecret="$JWT_SECRET" \
  > erigon.log 2>&1 &

