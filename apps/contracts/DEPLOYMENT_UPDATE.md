# DSU Deployment Update - DSUMinting Integration

## Changes Summary

The deployment sequence has been updated to include **DSUMinting**, the contract that handles minting and redeeming of DSU tokens with collateral.

### Updated Deployment Sequence

The new deployment order is:

1. **DSUBlacklist** - Access-controlled blacklist
2. **DSU** (Implementation + Proxy) - UUPS upgradeable ERC20 token
3. **DSUMinting** - Minting/redeeming contract ⭐ NEW
4. **Grant MINTER_ROLE** - DSU → DSUMinting ⭐ NEW
5. **DSUOFTAdapter** - LayerZero cross-chain adapter
6. **DSUSilo** - Cooldown storage
7. **DSUVault** (Implementation + Proxy) - UUPS upgradeable staking vault

### What is DSUMinting?

DSUMinting is the contract responsible for:

- Minting DSU tokens in exchange for collateral (e.g., WETH, USDC, USDT)
- Redeeming DSU tokens back to collateral
- Managing collateral custody and transfers
- Rate limiting mints/redeems per block
- EIP-712 signature verification for orders

### New Environment Variables

Add these to your `.env` file:

```bash
# Required
WETH_ADDRESS=0x...  # Wrapped ETH address for your network

# Optional DSUMinting Configuration
COLLATERAL_ASSETS='["0x...","0x..."]'  # JSON array of collateral tokens
CUSTODIAN_ADDRESSES='["0x..."]'         # JSON array of custodian addresses
GLOBAL_MAX_MINT_PER_BLOCK=100000000000000000000000   # 100k DSU
GLOBAL_MAX_REDEEM_PER_BLOCK=100000000000000000000000 # 100k DSU
MAX_MINT_PER_BLOCK=50000000000000000000000           # 50k DSU per asset
MAX_REDEEM_PER_BLOCK=50000000000000000000000         # 50k DSU per asset
```

### WETH Addresses by Network

**Mainnets:**

- Ethereum: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- Arbitrum: `0x82aF49447D8a07e3bd95BD0d56f35241523fBab1`
- Optimism: `0x4200000000000000000000000000000000000006`

**Testnets:**

- Sepolia: `0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9`
- Arbitrum Sepolia: `0x980B62Da83eFf3D4576C647993b0c1D7faf17c73`

## Changes Made

### 1. Fixed DSUMinting Contract

Updated DSUMinting to compile with OpenZeppelin v5 and Solidity 0.8.29:

- Fixed import paths (ReentrancyGuard moved to `utils/`)
- Added `MessageHashUtils` for EIP-712
- Created `SingleAdminAccessControl` base contract
- Renamed `WETH9.sol` to `IWETH9.sol`

### 2. Updated Deployment Script

`script/Deploy.s.sol` now includes:

- DSUMinting deployment with proper configuration
- Automatic MINTER_ROLE grant to DSUMinting
- Verification of DSUMinting deployment
- Support for collateral assets and custodians

### 3. Updated Configuration

New configuration fields in `DeploymentConfig`:

```solidity
address wethAddress;
address[] collateralAssets;
uint128 globalMaxMintPerBlock;
uint128 globalMaxRedeemPerBlock;
uint128 maxMintPerBlock;
uint128 maxRedeemPerBlock;
address[] custodianAddresses;
```

## Deployment Example

```bash
# 1. Update .env with new variables
WETH_ADDRESS=0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9  # Sepolia WETH
ADMIN_ADDRESS=0x...
TREASURY_ADDRESS=0x...
LAYERZERO_ENDPOINT=0x6EDCE65403992e310A62460808c4b910D972f10f
SEPOLIA_RPC_URL=https://...
ETHERSCAN_API_KEY=...

# 2. Deploy to Sepolia
forge script script/Deploy.s.sol \
  --rpc-url sepolia \
  --broadcast \
  --verify \
  -vvvv \
  --interactives 1
```

## Post-Deployment

After deployment, DSUMinting will have:

- MINTER_ROLE on DSU token (can mint tokens)
- DEFAULT_ADMIN_ROLE granted to configured admin
- Configured collateral assets (defaults to WETH)
- Configured minting/redeeming limits

### Minting DSU

To mint DSU through DSUMinting:

1. User approves collateral token to DSUMinting
2. User (or authorized minter) creates and signs an order
3. Minter calls `mint(order, route, signature)`
4. DSUMinting validates order and signature
5. DSUMinting transfers collateral from user
6. DSUMinting mints DSU to beneficiary

### DSUMinting Roles

The DSUMinting contract has these roles:

- `DEFAULT_ADMIN_ROLE` - Manages all roles and configuration
- `MINTER_ROLE` - Can execute mint orders
- `REDEEMER_ROLE` - Can execute redeem orders
- `COLLATERAL_MANAGER_ROLE` - Can transfer collateral to custody
- `GATEKEEPER_ROLE` - Emergency pause/disable

## Architecture Update

```
┌────────────────┐
│  DSUBlacklist  │
└────────┬───────┘
         │ checks
         ▼
┌────────────────┐    ┌────────────────┐
│  DSU (Proxy)   │◄───│  DSU Impl      │
└────────┬───────┘    └────────────────┘
         │ MINTER_ROLE
         ▼
┌────────────────┐
│  DSUMinting    │──► Manages collateral
│                │──► Mints/Redeems DSU
└────────────────┘

┌────────────────┐
│ DSUOFTAdapter  │──► Cross-chain
└────────────────┘

┌────────────────┐    ┌────────────────┐
│ DSUVault Proxy │◄───│ DSUVault Impl  │
└────────┬───────┘    └────────────────┘
         │
         ▼
┌────────────────┐
│   DSUSilo      │
└────────────────┘
```

## Important Notes

1. **DSUMinting has MINTER_ROLE**: The minter address configured in `.env` will also have MINTER_ROLE, but DSUMinting is the intended minting mechanism for production.

2. **Collateral Management**: Set up custodian addresses if you want to transfer collateral to cold storage.

3. **Rate Limits**: Adjust `MAX_MINT_PER_BLOCK` and `MAX_REDEEM_PER_BLOCK` based on your risk tolerance and expected volume.

4. **Testing**: Test the complete mint/redeem flow on testnet before mainnet deployment.

## Verification

The deployment script automatically verifies:

- ✅ DSU has DSUMinting as a MINTER_ROLE holder
- ✅ DSUMinting references correct DSU proxy address
- ✅ All other role assignments
- ✅ Contract linking

## Files Updated

- `script/Deploy.s.sol` - Updated deployment sequence
- `src/DSUMinting.sol` - Fixed for OpenZeppelin v5
- `src/SingleAdminAccessControl.sol` - New base contract
- `src/interfaces/IWETH9.sol` - Renamed from WETH9.sol
- `src/interfaces/IDSU.sol` - Fixed pragma version
- `src/interfaces/IDSUMinting.sol` - Fixed pragma version
- `ENV_TEMPLATE.txt` - Added DSUMinting variables
- `foundry.toml` - Already configured

## Next Steps

1. Review the new environment variables
2. Configure collateral assets for your use case
3. Set appropriate minting/redeeming limits
4. Deploy to testnet
5. Test mint and redeem operations
6. Set up custodian addresses if needed
7. Configure DSUMinting roles for operators

## Support

For issues or questions about the DSUMinting integration:

- Check DSUMinting source code in `src/DSUMinting.sol`
- Review IDSUMinting interface in `src/interfaces/IDSUMinting.sol`
- See deployment script in `script/Deploy.s.sol`
