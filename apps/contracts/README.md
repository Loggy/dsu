# DSU Smart Contracts

Decentralized Stable Unit (DSU) token system with cross-chain capabilities and staking vault.

## Overview

This repository contains the smart contracts for the DSU token ecosystem:

- **DSUBlacklist**: Access-controlled blacklist for restricting addresses
- **DSU**: UUPS upgradeable ERC20 token with pause, burn, mint, and permit functionality
- **DSUOFTAdapter**: LayerZero OFT adapter for cross-chain transfers
- **DSUSilo**: Holds DSU tokens during cooldown periods
- **DSUVault**: UUPS upgradeable ERC4626 vault for staking DSU with rewards

## Quick Start

### 1. Install Dependencies

```shell
forge install
```

### 2. Compile Contracts

```shell
forge build
```

### 3. Run Tests

```shell
forge test
```

### 4. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick deploy to testnet:**

```shell
# Set up .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your configuration
# Then deploy:
forge script script/Deploy.s.sol --rpc-url sepolia --broadcast --verify
```

## Contract Architecture

### Upgradeable Contracts (UUPS Pattern)

Two contracts use UUPS upgradeability:

- **DSU** (ERC20 Token)
- **DSUVault** (ERC4626 Vault)

Each deploys:

1. Implementation contract (logic)
2. Proxy contract (state + delegation)

⚠️ **Always interact with the proxy address, not the implementation!**

### Deployment Order

```
DSUBlacklist → DSU → DSUOFTAdapter → DSUSilo → DSUVault
```

The deployment script handles this automatically.

## Development Commands

### Build

```shell
forge build
```

### Test

```shell
# Run all tests
forge test

# Run with gas reporting
forge test --gas-report

# Run specific test
forge test --match-test testDeposit

# Run with verbosity
forge test -vvvv
```

### Format

```shell
forge fmt
```

### Gas Snapshots

```shell
forge snapshot
```

### Coverage

```shell
forge coverage
```

### Local Development

Start local Ethereum node:

```shell
anvil
```

Deploy to local node:

```shell
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
```

## Interacting with Contracts

### Using Cast

```shell
# Check DSU balance
cast call <DSU_PROXY> "balanceOf(address)(uint256)" <ADDRESS> --rpc-url sepolia

# Mint tokens (requires MINTER_ROLE)
cast send <DSU_PROXY> "mint(address,uint256)" <TO> <AMOUNT> --rpc-url sepolia --private-key <KEY>

# Stake DSU in vault
cast send <VAULT_PROXY> "deposit(uint256,address)(uint256)" <AMOUNT> <RECEIVER> --rpc-url sepolia --private-key <KEY>
```

## Security

### Audits

⚠️ These contracts have not been audited. Use at your own risk.

### Bug Bounty

No bug bounty program is currently active.

## Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [OpenZeppelin Upgradeable Contracts](https://docs.openzeppelin.com/upgrades-plugins/)
- [LayerZero V2 Documentation](https://docs.layerzero.network/v2)
- [ERC4626 Specification](https://eips.ethereum.org/EIPS/eip-4626)

## Help

```shell
forge --help
anvil --help
cast --help
```
