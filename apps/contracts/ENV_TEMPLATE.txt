# ====================================
# DSU System Environment Variables Template
# ====================================
# Copy this content to a file named ".env" in the contracts directory
# Then fill in your actual values
# ====================================

# ====================================
# Required Environment Variables
# ====================================

# Private key of the deployer account (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Admin address - has full control over all contracts
ADMIN_ADDRESS=0x...

# Treasury address - receives redistributed funds
TREASURY_ADDRESS=0x...

# LayerZero Endpoint address for cross-chain functionality
# Mainnets:
# - Ethereum: 0x1a44076050125825900e736c501f859c50fE728c
# - Arbitrum: 0x1a44076050125825900e736c501f859c50fE728c
# - Optimism: 0x1a44076050125825900e736c501f859c50fE728c
# Testnets:
# - Sepolia: 0x6EDCE65403992e310A62460808c4b910D972f10f
# - Arbitrum Sepolia: 0x6EDCE65403992e310A62460808c4b910D972f10f
LAYERZERO_ENDPOINT=0x...

# WETH (Wrapped ETH) address for DSUMinting
# Mainnets:
# - Ethereum: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
# - Arbitrum: 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1
# - Optimism: 0x4200000000000000000000000000000000000006
# Testnets:
# - Sepolia: 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9
# - Arbitrum Sepolia: 0x980B62Da83eFf3D4576C647993b0c1D7faf17c73
WETH_ADDRESS=0x...

# ====================================
# Optional Environment Variables
# (defaults to ADMIN_ADDRESS if not set)
# ====================================

# Address that can pause the DSU token
PAUSER_ADDRESS=0x...

# Address that can mint new DSU tokens
MINTER_ADDRESS=0x...

# Address that can upgrade DSU and DSUVault implementations
UPGRADER_ADDRESS=0x...

# Address that can transfer rewards to the vault
REWARDER_ADDRESS=0x...

# Initial vesting period for rewards in seconds (default: 7 days)
# Must be <= 7 days (604800 seconds)
INITIAL_VESTING_PERIOD=604800

# Initial cooldown duration for withdrawals in seconds (default: 0 = disabled)
# Must be <= 90 days (7776000 seconds)
# Set to 0 to disable cooldown on deployment
INITIAL_COOLDOWN_DURATION=0

# ====================================
# DSUMinting Configuration
# ====================================

# Collateral assets accepted for minting (JSON array format, optional)
# If not specified, defaults to WETH_ADDRESS
# Example: COLLATERAL_ASSETS='["0x...", "0x..."]'
COLLATERAL_ASSETS=

# Custodian addresses for collateral management (JSON array format, optional)
# Example: CUSTODIAN_ADDRESSES='["0x...", "0x..."]'
CUSTODIAN_ADDRESSES=

# Maximum DSU that can be minted globally per block (default: 100000 ether)
GLOBAL_MAX_MINT_PER_BLOCK=100000000000000000000000

# Maximum DSU that can be redeemed globally per block (default: 100000 ether)
GLOBAL_MAX_REDEEM_PER_BLOCK=100000000000000000000000

# Maximum DSU that can be minted per asset per block (default: 50000 ether)
MAX_MINT_PER_BLOCK=50000000000000000000000

# Maximum DSU that can be redeemed per asset per block (default: 50000 ether)
MAX_REDEEM_PER_BLOCK=50000000000000000000000

# ====================================
# RPC URLs for different networks
# ====================================

# Mainnet
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR_API_KEY
OPTIMISM_RPC_URL=https://opt-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Testnets
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
ARBITRUM_SEPOLIA_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# ====================================
# Etherscan API Keys for Verification
# ====================================

ETHERSCAN_API_KEY=your_etherscan_api_key
ARBISCAN_API_KEY=your_arbiscan_api_key
OPTIMISM_API_KEY=your_optimism_api_key

