# 🚀 Deploy DSU Locally - 2 Commands!

## Step 1: Start Anvil

```bash
cd apps/contracts
anvil
```

Keep this running!

## Step 2: Deploy Everything (New Terminal)

```bash
cd apps/contracts
./deploy.sh
```

## Done! 🎉

You'll see your contract addresses:

```
CONTRACT ADDRESSES FOR FRONTEND:
-----------------------------------
DSU (Token):       0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
DSUMinting:        0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
DSUVault (Vault):  0x610178dA211FEF7D417bC0e6FeD39F05609AD788
MockWETH:          0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Save these addresses for your frontend!**

## Connect Frontend

### MetaMask Setup:

1. **Add Network:**

   - Network Name: Anvil
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: ETH

2. **Import Account:**
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - This is Anvil's funded test account (has 10,000 ETH!)

## Quick Test

```bash
# Mint 1000 DSU tokens
cast send 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 \
  "mint(address,uint256)" \
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
  1000000000000000000000 \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --chain 31337

# Check balance
cast call 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 \
  "balanceOf(address)(uint256)" \
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
  --rpc-url http://127.0.0.1:8545
```

## Start Fresh Anytime

```bash
# Stop Anvil (Ctrl+C)
# Start again
anvil
# Deploy again
./deploy.sh
```

## Frontend Config Example

```typescript
export const CONTRACTS = {
  dsu: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  vault: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
  minting: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  weth: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
};

export const ANVIL = {
  id: 31337,
  rpcUrl: "http://127.0.0.1:8545",
};
```

## ⚠️ Important Notes

- **Always add `--chain 31337`** when using `cast send`
- Addresses will change each time you restart Anvil
- Never use these keys on real networks (testnet or mainnet)!

## Need More Details?

- **Frontend Integration:** See `FRONTEND_INTEGRATION.md`
- **Deployment to Testnet:** See `DEPLOYMENT.md`
- **Architecture:** See `ARCHITECTURE.md`

**You're all set!** Start building your frontend! 🎨
