#!/bin/bash

echo "========================================="
echo "   DSU Local Deployment - Simple!"
echo "========================================="
echo ""

# Check if Anvil is running
if ! curl -s -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://127.0.0.1:8545 > /dev/null 2>&1; then
    echo "❌ Error: Anvil is not running!"
    echo ""
    echo "Please start Anvil in another terminal:"
    echo "  cd apps/contracts"
    echo "  anvil"
    echo ""
    exit 1
fi

echo "✓ Anvil is running"
echo ""

# Get the deployer address from environment or use default
DEPLOYER_ADDRESS=${DEPLOYER_ADDRESS:-0x993C6973716DC2247557595FBd5cf1087595578C}

# Check deployer balance
echo "Checking deployer balance..."
BALANCE=$(cast balance $DEPLOYER_ADDRESS --rpc-url http://127.0.0.1:8545)

# If balance is less than 0.1 ETH, fund the account
if [ "$BALANCE" -lt "100000000000000000" ]; then
    echo "  Deployer has insufficient funds. Funding account..."
    cast send $DEPLOYER_ADDRESS \
      --value 1ether \
      --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
      --rpc-url http://127.0.0.1:8545 \
      --chain 31337 \
      > /dev/null 2>&1
    echo "  ✓ Funded deployer with 1 ETH"
else
    echo "  ✓ Deployer has sufficient funds"
fi
echo ""

echo "Deploying all contracts..."
echo ""

# Deploy with Anvil's default Account #0 (has 10k ETH)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
ADMIN_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
TREASURY_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
forge script script/DeployAll.s.sol \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast \
  --silent 2>&1 | grep -A 30 "DEPLOYMENT COMPLETE"

echo ""
echo "========================================="
echo "   Ready for Frontend Development! 🚀"
echo "========================================="
echo ""
echo "Network: http://127.0.0.1:8545 (Chain ID: 31337)"
echo "Admin: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
echo "Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
echo ""
echo "Import the private key into MetaMask to interact!"
echo ""

