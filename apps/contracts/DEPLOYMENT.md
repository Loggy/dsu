# DSU System Deployment Guide

This guide explains how to deploy the DSU token system using Foundry.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Contract Overview](#contract-overview)
- [Deployment Sequence](#deployment-sequence)
- [Setup Instructions](#setup-instructions)
- [Deployment Commands](#deployment-commands)
- [Verification](#verification)
- [Post-Deployment](#post-deployment)

## Prerequisites

1. **Install Foundry** (if not already installed):

   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Install Dependencies**:

   ```bash
   cd apps/contracts
   forge install
   ```

3. **Compile Contracts**:
   ```bash
   forge build
   ```

## Contract Overview

The DSU system consists of 5 contracts deployed in a specific order:

| Contract          | Type             | Description                                                  |
| ----------------- | ---------------- | ------------------------------------------------------------ |
| **DSUBlacklist**  | Standard         | Access-controlled blacklist for restricting addresses        |
| **DSU**           | UUPS Upgradeable | ERC20 token with pause, burn, mint, and permit functionality |
| **DSUOFTAdapter** | Standard         | LayerZero OFT adapter for cross-chain transfers              |
| **DSUSilo**       | Standard         | Holds DSU during cooldown periods                            |
| **DSUVault**      | UUPS Upgradeable | ERC4626 vault for staking DSU with rewards                   |

### Upgradeable Contracts

Two contracts use the **UUPS (Universal Upgradeable Proxy Standard)** pattern:

- **DSU**: The main token contract
- **DSUVault**: The staking vault

For each upgradeable contract, two contracts are deployed:

1. **Implementation**: The actual contract logic
2. **Proxy**: ERC1967Proxy that delegates calls to the implementation

**Important**: Always interact with the **proxy address**, not the implementation!

## Deployment Sequence

The deployment script (`script/Deploy.s.sol`) deploys contracts in this order:

```
1. DSUBlacklist
   ↓
2. DSU (Implementation + Proxy)
   ↓
3. DSUOFTAdapter (uses DSU proxy)
   ↓
4. DSUSilo (uses DSU proxy)
   ↓
5. DSUVault (Implementation + Proxy, uses DSU proxy and Silo)
```

## Setup Instructions

### 1. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values:

```bash
# Required
PRIVATE_KEY=your_deployer_private_key
ADMIN_ADDRESS=0x...
TREASURY_ADDRESS=0x...
LAYERZERO_ENDPOINT=0x...

# Optional (defaults to ADMIN_ADDRESS)
PAUSER_ADDRESS=0x...
MINTER_ADDRESS=0x...
UPGRADER_ADDRESS=0x...
REWARDER_ADDRESS=0x...

# Optional Configuration
INITIAL_VESTING_PERIOD=604800  # 7 days in seconds
INITIAL_COOLDOWN_DURATION=0    # 0 = disabled

# RPC URLs
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# For verification
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 2. LayerZero Endpoint Addresses

Choose the correct LayerZero V2 endpoint for your network:

**Mainnets:**

- Ethereum: `0x1a44076050125825900e736c501f859c50fE728c`
- Arbitrum: `0x1a44076050125825900e736c501f859c50fE728c`
- Optimism: `0x1a44076050125825900e736c501f859c50fE728c`

**Testnets:**

- Sepolia: `0x6EDCE65403992e310A62460808c4b910D972f10f`
- Arbitrum Sepolia: `0x6EDCE65403992e310A62460808c4b910D972f10f`

[Full list of endpoints](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts)

## Deployment Commands

### Local Testing (Anvil)

Start a local node:

```bash
anvil
```

In a new terminal, deploy:

```bash
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast -vvvv
```

### Testnet Deployment (e.g., Sepolia)

**Dry run** (simulation without broadcasting):

```bash
forge script script/Deploy.s.sol --rpc-url sepolia -vvvv
```

**Deploy without verification**:

```bash
forge script script/Deploy.s.sol \
  --rpc-url sepolia \
  --broadcast \
  -vvvv \
  --interactives 1
```

**Deploy with automatic verification**:

```bash
forge script script/Deploy.s.sol \
  --rpc-url sepolia \
  --broadcast \
  --verify \
  -vvvv \
  --interactives 1
```

### Mainnet Deployment

⚠️ **CAUTION**: Always test on testnet first!

```bash
forge script script/Deploy.s.sol \
  --rpc-url mainnet \
  --broadcast \
  --verify \
  --gas-estimate-multiplier 120 \
  -vvvv \
  --interactives 1
```

### Resume Failed Deployment

If deployment fails partway through:

```bash
forge script script/Deploy.s.sol \
  --rpc-url sepolia \
  --resume
```

## Verification

### Automatic Verification

If you used `--verify` during deployment, contracts are verified automatically.

### Manual Verification

If automatic verification fails, verify manually:

```bash
# Verify standard contracts
forge verify-contract <CONTRACT_ADDRESS> <CONTRACT_NAME> --chain sepolia

# Example for DSUBlacklist
forge verify-contract 0x123... DSUBlacklist --chain sepolia --constructor-args $(cast abi-encode "constructor(address)" 0xADMIN_ADDRESS)

# Verify proxy contracts
forge verify-contract <PROXY_ADDRESS> ERC1967Proxy --chain sepolia --constructor-args $(cast abi-encode "constructor(address,bytes)" <IMPLEMENTATION_ADDRESS> <INIT_DATA>)
```

### Verify Deployment Success

The deployment script includes built-in verification checks:

- Role assignments for all contracts
- Proper initialization of upgradeable contracts
- Correct linking between contracts

Check the console output for verification results.

## Post-Deployment

### 1. Save Deployment Addresses

The script outputs all deployed addresses. Save them for reference:

```json
{
  "DSUBlacklist": "0x...",
  "DSU_Implementation": "0x...",
  "DSU_Proxy": "0x...",
  "DSUOFTAdapter": "0x...",
  "DSUSilo": "0x...",
  "DSUVault_Implementation": "0x...",
  "DSUVault_Proxy": "0x..."
}
```

### 2. Important Notes

**Interact with Proxy Addresses:**

- Use `DSU_Proxy` for token operations (not `DSU_Implementation`)
- Use `DSUVault_Proxy` for vault operations (not `DSUVault_Implementation`)

**OFT Adapter Configuration:**

- You need to configure the OFT adapter for cross-chain messaging
- Set trusted remotes for each chain you want to support
- See [LayerZero documentation](https://docs.layerzero.network/v2/home/intro)

### 3. Grant Minter Role to Vault (Optional)

If you want the vault to be able to mint rewards:

```bash
cast send <DSU_PROXY_ADDRESS> \
  "grantRole(bytes32,address)" \
  $(cast keccak "MINTER_ROLE") \
  <VAULT_PROXY_ADDRESS> \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY
```

### 4. Test Basic Functionality

```bash
# Mint some tokens
cast send <DSU_PROXY_ADDRESS> \
  "mint(address,uint256)" \
  <RECIPIENT_ADDRESS> \
  1000000000000000000000 \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY

# Check balance
cast call <DSU_PROXY_ADDRESS> \
  "balanceOf(address)(uint256)" \
  <RECIPIENT_ADDRESS> \
  --rpc-url sepolia
```

## Upgrading Contracts

To upgrade DSU or DSUVault in the future:

1. Deploy new implementation contract
2. Call `upgradeToAndCall` on the proxy (requires UPGRADER_ROLE)

Example:

```bash
cast send <DSU_PROXY_ADDRESS> \
  "upgradeToAndCall(address,bytes)" \
  <NEW_IMPLEMENTATION_ADDRESS> \
  0x \
  --rpc-url sepolia \
  --private-key $PRIVATE_KEY
```

## Troubleshooting

### "nonce too low" error

```bash
# Reset nonce cache
rm -rf ~/.foundry/cache
```

### "insufficient funds" error

- Ensure deployer account has enough ETH for gas
- Use `--gas-estimate-multiplier 120` for safer gas estimation

### Deployment hangs

- Check RPC URL is correct and accessible
- Try adding `-vvvv` flag for detailed logs
- Consider using `--legacy` flag for networks without EIP-1559

### Verification fails

- Wait a few minutes after deployment before verifying
- Ensure ETHERSCAN_API_KEY is set correctly
- Verify manually using `forge verify-contract`

## Support

For issues or questions:

- Check Foundry documentation: https://book.getfoundry.sh/
- LayerZero documentation: https://docs.layerzero.network/
- OpenZeppelin upgradeable contracts: https://docs.openzeppelin.com/upgrades-plugins/
