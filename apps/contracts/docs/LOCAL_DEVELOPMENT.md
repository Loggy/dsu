# Local Development with Anvil

Complete guide for running DSU contracts locally for frontend development.

## Quick Start (3 Steps)

### 1. Start Anvil

```bash
cd apps/contracts
anvil
```

Keep this terminal open - it's your local blockchain!

### 2. Deploy Everything (One Command)

In a new terminal:

```bash
cd apps/contracts
./deploy-local.sh
```

That's it! Your contracts are deployed locally. 🎉

### 3. Get Contract Addresses

The script will output all contract addresses. Save them for your frontend:

```
DSU Token (Proxy):  0x...
DSUMinting:         0x...
DSUVault (Proxy):   0x...
MockWETH:           0x...
```

## Detailed Instructions

### Step 1: Start Local Blockchain

```bash
cd apps/contracts
anvil
```

**Anvil provides:**

- 10 pre-funded accounts (each with 10,000 ETH)
- Instant block mining
- No gas costs (free testing!)
- Reset anytime by restarting Anvil

**Default RPC:** `http://127.0.0.1:8545`
**Chain ID:** 31337

### Step 2: Deploy Mock Contracts

First, deploy WETH and LayerZero mocks:

```bash
forge script script/DeployLocal.s.sol \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast
```

**Note the addresses** printed for WETH and LayerZero endpoint.

### Step 3: Update .env.local

Create `.env.local` with the mock addresses:

```bash
PRIVATE_KEY=ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d59bf3b7359
ADMIN_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
TREASURY_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
WETH_ADDRESS=0xYourMockWETHAddress
LAYERZERO_ENDPOINT=0xYourMockLZEndpoint
SEPOLIA_RPC_URL=http://127.0.0.1:8545
```

### Step 4: Deploy DSU System

```bash
forge script script/Deploy.s.sol \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast
```

## Frontend Integration

### Network Configuration

Add Anvil network to your frontend (e.g., wagmi/viem config):

```typescript
import { defineChain } from "viem";

export const anvil = defineChain({
  id: 31337,
  name: "Anvil",
  network: "anvil",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
    },
  },
});
```

### Contract Addresses

Create a config file with your deployed addresses:

```typescript
// contracts/config.ts
export const CONTRACTS = {
  dsu: "0x...", // DSU Proxy address
  dsuMinting: "0x...", // DSUMinting address
  dsuVault: "0x...", // DSUVault Proxy address
  weth: "0x...", // MockWETH address
};
```

### Using Anvil Accounts in Frontend

Import Anvil's test accounts into MetaMask:

**Account 0 (Deployer/Admin):**

- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d59bf3b7359`

**Account 1 (Test User):**

- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

**⚠️ Never use these keys on mainnet or testnet!**

### Add Anvil to MetaMask

1. Open MetaMask
2. Networks → Add Network → Add network manually
3. Fill in:
   - **Network Name:** Anvil Local
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH

## Testing Contract Interactions

### Mint DSU (via Direct Mint)

Since you're the admin and minter:

```bash
# Mint 1000 DSU to Account 1
cast send $DSU_PROXY \
  "mint(address,uint256)" \
  0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
  1000000000000000000000 \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d59bf3b7359
```

### Check Balance

```bash
cast call $DSU_PROXY \
  "balanceOf(address)(uint256)" \
  0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
  --rpc-url http://127.0.0.1:8545
```

### Stake in Vault

```bash
# First approve vault
cast send $DSU_PROXY \
  "approve(address,uint256)" \
  $VAULT_PROXY \
  1000000000000000000000 \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

# Then deposit
cast send $VAULT_PROXY \
  "deposit(uint256,address)(uint256)" \
  1000000000000000000000 \
  0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

## Helper Scripts

### Reset Everything

To start fresh, just restart Anvil:

```bash
# Stop Anvil (Ctrl+C)
# Start again
anvil
# Re-deploy
./deploy-local.sh
```

### Deploy Specific Contract

If you only need to redeploy one contract:

```bash
# Deploy just DSU
forge create src/DSU.sol:DSU \
  --constructor-args $BLACKLIST_ADDRESS \
  --rpc-url http://127.0.0.1:8545 \
  --private-key $PRIVATE_KEY
```

## Frontend Development Tips

### 1. Auto-mine Blocks

Anvil auto-mines by default. For manual mining:

```bash
anvil --block-time 1  # Mine every 1 second
```

### 2. Impersonate Accounts

You can impersonate any account:

```bash
cast rpc anvil_impersonateAccount 0xSomeAddress
```

### 3. Set Block Timestamp

Useful for testing time-based features:

```bash
cast rpc evm_setNextBlockTimestamp 1640000000
```

### 4. Snapshot and Revert

Save blockchain state:

```bash
# Take snapshot
SNAPSHOT_ID=$(cast rpc evm_snapshot)

# Do some testing...

# Revert to snapshot
cast rpc evm_revert $SNAPSHOT_ID
```

## Common Issues

### "Connection refused"

- Make sure Anvil is running
- Check RPC URL is `http://127.0.0.1:8545`

### "Nonce too high"

- Restart Anvil (it resets state)
- Or use: `cast rpc anvil_reset`

### "Transaction reverted"

- Check you're using the right account
- Check account has enough ETH
- Add `-vvvv` to see detailed error

### Contract not deployed

- Make sure deployment script completed
- Check contract address is correct
- Verify using: `cast code $ADDRESS --rpc-url http://127.0.0.1:8545`

## Environment Comparison

| Feature  | Anvil (Local)     | Sepolia (Testnet) | Mainnet       |
| -------- | ----------------- | ----------------- | ------------- |
| Speed    | Instant           | ~12 sec/block     | ~12 sec/block |
| Cost     | Free              | Free (faucet)     | Real ETH      |
| State    | Resets on restart | Persistent        | Persistent    |
| Best for | Development       | Testing           | Production    |

## Advanced: Fork Mainnet Locally

You can fork mainnet to test with real contracts:

```bash
anvil --fork-url https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
```

Then deploy your contracts on the fork!

## Next Steps

1. ✅ Deploy contracts locally
2. 🎨 Build your frontend
3. 🧪 Test all interactions
4. 📝 Document your flows
5. 🚀 Deploy to Sepolia
6. 🎉 Deploy to Mainnet

## Resources

- [Foundry Book - Anvil](https://book.getfoundry.sh/anvil/)
- [Cast Commands](https://book.getfoundry.sh/reference/cast/)
- [Viem - Local Chains](https://viem.sh/docs/chains/introduction.html)
- [Wagmi - Custom Chains](https://wagmi.sh/core/chains)
