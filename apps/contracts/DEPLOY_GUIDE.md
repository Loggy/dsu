# DSU Deployment Guide

## Understanding the Deployment

The `DeployAll.s.sol` script deploys the complete DSU system with the following role structure:

### Roles & Access Control

**Admin Account** (gets all roles):

- `DEFAULT_ADMIN_ROLE` - Can grant/revoke all other roles
- `PAUSER_ROLE` - Can pause/unpause DSU token
- `MINTER_ROLE` - Can mint DSU tokens directly
- `UPGRADER_ROLE` - Can upgrade UUPS proxies
- `REWARDER_ROLE` - Can add rewards to vault

**DSUMinting Contract** (gets MINTER_ROLE):

- Can mint DSU through the official minting process

### Determining the Admin

The admin is determined in this order:

1. **`ADMIN_ADDRESS` env variable** (if set)
2. **Falls back to deployer** (address derived from `PRIVATE_KEY`)

```solidity
admin = vm.envOr("ADMIN_ADDRESS", vm.addr(deployerPrivateKey));
```

## Clean Deployment Process

### 1. Set Up Environment

Create `.env` file in `apps/contracts/`:

```bash
# Required
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d59bf3b7359

# Optional (defaults to deployer if not set)
ADMIN_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
TREASURY_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

### 2. Start Fresh Anvil

```bash
# Kill any existing Anvil
pkill anvil

# Start new Anvil
anvil
```

This will give you 10 pre-funded accounts with the standard private keys.

### 3. Deploy Contracts

```bash
cd apps/contracts
forge script script/DeployAll.s.sol --broadcast --rpc-url http://127.0.0.1:8545 -vvvv
```

### 4. Extract Contract Addresses

The script prints all addresses. Example output:

```
CONTRACT ADDRESSES FOR FRONTEND:
-----------------------------------
DSU (Token):       0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9
DSUMinting:        0x5fc8d32690cc91d4c39d9d3abcbd16989f875707
DSUVault (Vault):  0x0165878a594ca255338adfa4d48449f69242eb8f
```

### 5. Update Frontend `.env.local`

```bash
cd apps/app
cat > .env.local << EOF
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_DSU_ADDRESS_LOCAL=0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9
NEXT_PUBLIC_VAULT_ADDRESS_LOCAL=0x0165878a594ca255338adfa4d48449f69242eb8f
NEXT_PUBLIC_MINTING_ADDRESS_LOCAL=0x5fc8d32690cc91d4c39d9d3abcbd16989f875707
EOF
```

### 6. Configure MetaMask

**Import Admin Account:**

```
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d59bf3b7359
Address:     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

This account has:

- ✅ 10,000 ETH
- ✅ All admin roles (can mint, pause, upgrade, etc.)

**Add Anvil Network:**

- Network Name: Anvil Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency: ETH

## Verifying Deployment

Check roles after deployment:

```bash
# Check admin has MINTER_ROLE
cast call $DSU_ADDRESS "hasRole(bytes32,address)(bool)" \
  $(cast keccak "MINTER_ROLE()") \
  $ADMIN_ADDRESS \
  --rpc-url http://127.0.0.1:8545

# Check DSUMinting has MINTER_ROLE
cast call $DSU_ADDRESS "hasRole(bytes32,address)(bool)" \
  $(cast keccak "MINTER_ROLE()") \
  $MINTING_ADDRESS \
  --rpc-url http://127.0.0.1:8545
```

Both should return `true`.

## Granting Additional Roles

To grant MINTER_ROLE to another address:

```bash
cast send $DSU_ADDRESS \
  "grantRole(bytes32,address)" \
  $(cast keccak "MINTER_ROLE()") \
  $NEW_MINTER_ADDRESS \
  --private-key $ADMIN_PRIVATE_KEY \
  --rpc-url http://127.0.0.1:8545
```

## Troubleshooting

### "Contract call reverted" when minting

**Cause:** Connected account doesn't have MINTER_ROLE

**Solution:** Use the admin account or grant role:

```bash
cast send $DSU_ADDRESS \
  "grantRole(bytes32,address)" \
  $(cast keccak "MINTER_ROLE()") \
  YOUR_ADDRESS \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d59bf3b7359 \
  --rpc-url http://127.0.0.1:8545
```

### Wrong contract addresses in UI

**Cause:** `.env.local` not updated or dev server not restarted

**Solution:**

1. Update `.env.local` with addresses from deployment output
2. Restart dev server: `pkill -f "next dev" && cd apps/app && pnpm dev`

### Balance shows 0 ETH

**Cause:** Wrong network or account not imported

**Solution:**

1. Check MetaMask is on "Anvil Local" (Chain ID 31337)
2. Import the correct private key
3. Refresh MetaMask

## Quick Reset

If things get messed up:

```bash
# 1. Kill Anvil
pkill anvil

# 2. Start fresh
anvil

# 3. Redeploy (in new terminal)
cd apps/contracts
forge script script/DeployAll.s.sol --broadcast --rpc-url http://127.0.0.1:8545

# 4. Update frontend addresses
# Copy addresses from output to apps/app/.env.local

# 5. Restart dev server
cd apps/app
pnpm dev
```

## Default Anvil Accounts

When you start `anvil`, you get 10 accounts:

| #   | Address           | Private Key        | Balance    |
| --- | ----------------- | ------------------ | ---------- |
| 0   | `0xf39Fd...92266` | `0xac0974...b7359` | 10,000 ETH |
| 1   | `0x70997...79C8`  | `0x59c699...8690d` | 10,000 ETH |
| 2   | `0x3C44C...293BC` | `0x5de411...365a`  | 10,000 ETH |

Account #0 is used as the default admin.

## For Production Deployments

**DO NOT use these private keys!**

For testnet/mainnet:

1. Generate new private key: `cast wallet new`
2. Fund the account
3. Set in `.env`:
   ```
   PRIVATE_KEY=your_secure_private_key
   ADMIN_ADDRESS=your_admin_address
   TREASURY_ADDRESS=your_treasury_address
   ```
4. Deploy with appropriate RPC URL:
   ```bash
   forge script script/DeployAll.s.sol \
     --broadcast \
     --rpc-url $SEPOLIA_RPC_URL \
     --verify \
     --etherscan-api-key $ETHERSCAN_API_KEY
   ```
