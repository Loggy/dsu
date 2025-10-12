# DSU Quick Start Guide

Get up and running with DSU smart contracts in 5 minutes.

## Prerequisites

Install Foundry:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Step-by-Step Deployment

### 1. Setup Environment

```bash
cd apps/contracts

# Copy environment template to .env
cat ENV_TEMPLATE.txt > .env

# Edit .env with your values
# Required: PRIVATE_KEY, ADMIN_ADDRESS, TREASURY_ADDRESS, LAYERZERO_ENDPOINT, SEPOLIA_RPC_URL
nano .env  # or use your preferred editor
```

### 2. Install Dependencies

```bash
forge install
```

### 3. Compile Contracts

```bash
forge build
```

Expected output: `Compiler run successful!`

### 4. Deploy to Sepolia Testnet

```bash
# Load environment variables
source .env

# Deploy
forge script script/Deploy.s.sol \
  --rpc-url sepolia \
  --broadcast \
  --verify \
  -vvvv \
  --interactives 1
```

The script will:

1. Deploy DSUBlacklist
2. Deploy DSU (Implementation + Proxy)
3. Deploy DSUOFTAdapter
4. Deploy DSUSilo
5. Deploy DSUVault (Implementation + Proxy)
6. Configure all contracts
7. Verify deployment

### 5. Save Contract Addresses

The script outputs all deployed addresses. **Save the proxy addresses** for future interactions:

```
DSU_PROXY=0x...
VAULT_PROXY=0x...
```

## Common Operations

### Mint Tokens

```bash
cast send $DSU_PROXY \
  "mint(address,uint256)" \
  0xRECIPIENT \
  1000000000000000000000 \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY
```

### Check Balance

```bash
cast call $DSU_PROXY \
  "balanceOf(address)(uint256)" \
  0xADDRESS \
  --rpc-url sepolia
```

### Deposit to Vault (Stake)

```bash
# First approve vault to spend tokens
cast send $DSU_PROXY \
  "approve(address,uint256)" \
  $VAULT_PROXY \
  1000000000000000000000 \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY

# Then deposit
cast send $VAULT_PROXY \
  "deposit(uint256,address)(uint256)" \
  1000000000000000000000 \
  0xRECIPIENT \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY
```

### Check Vault Balance (Shares)

```bash
cast call $VAULT_PROXY \
  "balanceOf(address)(uint256)" \
  0xADDRESS \
  --rpc-url sepolia
```

### Withdraw from Vault

```bash
# If cooldown is disabled (cooldownDuration = 0)
cast send $VAULT_PROXY \
  "withdraw(uint256,address,address)(uint256)" \
  1000000000000000000000 \
  0xRECEIVER \
  0xOWNER \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY
```

## Configuration

### Add Address to Blacklist

```bash
cast send $BLACKLIST_ADDRESS \
  "addToBlacklist(address)" \
  0xADDRESS_TO_BLACKLIST \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY
```

### Set Cooldown Duration

```bash
# Enable 24 hour cooldown (86400 seconds)
cast send $VAULT_PROXY \
  "setCooldownDuration(uint24)" \
  86400 \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY
```

### Set Vesting Period

```bash
# Set 7 day vesting period (604800 seconds)
cast send $VAULT_PROXY \
  "setVestingPeriod(uint32)" \
  604800 \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY
```

### Transfer Rewards to Vault

```bash
# First approve vault as spender
cast send $DSU_PROXY \
  "approve(address,uint256)" \
  $VAULT_PROXY \
  10000000000000000000000 \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY

# Transfer rewards (requires REWARDER_ROLE)
cast send $VAULT_PROXY \
  "transferInRewards(uint256)" \
  10000000000000000000000 \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY
```

## Role Management

### Grant Role

```bash
# Example: Grant MINTER_ROLE
MINTER_ROLE=$(cast keccak "MINTER_ROLE")

cast send $DSU_PROXY \
  "grantRole(bytes32,address)" \
  $MINTER_ROLE \
  0xNEW_MINTER_ADDRESS \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY
```

### Revoke Role

```bash
cast send $DSU_PROXY \
  "revokeRole(bytes32,address)" \
  $MINTER_ROLE \
  0xOLD_MINTER_ADDRESS \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY
```

## Upgrading Contracts

### Upgrade DSU

```bash
# 1. Deploy new implementation
forge create src/DSU.sol:DSU \
  --constructor-args $BLACKLIST_ADDRESS \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY

# 2. Note the deployed address, then upgrade
cast send $DSU_PROXY \
  "upgradeToAndCall(address,bytes)" \
  0xNEW_IMPLEMENTATION \
  0x \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY
```

### Upgrade Vault

```bash
# 1. Deploy new implementation
forge create src/DSUVault.sol:DSUVault \
  --constructor-args $TREASURY_ADDRESS \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY

# 2. Note the deployed address, then upgrade
cast send $VAULT_PROXY \
  "upgradeToAndCall(address,bytes)" \
  0xNEW_IMPLEMENTATION \
  0x \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY
```

## Testing

### Run All Tests

```bash
forge test
```

### Run Specific Test

```bash
forge test --match-test testDeposit
```

### Run with Gas Report

```bash
forge test --gas-report
```

### Run with Detailed Trace

```bash
forge test -vvvv
```

## Local Development

### Start Local Node

```bash
anvil
```

In a new terminal:

```bash
# Deploy to local node (uses anvil's default accounts)
forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast
```

## Troubleshooting

### "Compiler not found"

```bash
foundryup
```

### "Library not found"

```bash
forge install
forge build
```

### "Invalid nonce"

```bash
rm -rf ~/.foundry/cache
```

### "Insufficient funds"

Make sure deployer account has testnet ETH. For Sepolia:

- https://sepoliafaucet.com/
- https://faucet.quicknode.com/ethereum/sepolia

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment information
- Check [README.md](./README.md) for architecture overview
- Review contract source code in `src/` directory

## Important Notes

⚠️ **Always use proxy addresses** for DSU and DSUVault, never the implementation addresses!

⚠️ **Test on testnet first** before deploying to mainnet!

⚠️ **Contracts are not audited** - use at your own risk!
