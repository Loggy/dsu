# Environment Variables Setup

Create a `.env.local` file in the `apps/app` directory with the following variables:

## Required

```bash
# WalletConnect Project ID
# Get one at https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## Optional RPC URLs

If not provided, public RPCs will be used:

```bash
NEXT_PUBLIC_MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

## Contract Addresses

### Anvil Local (Chain ID: 31337)

Default addresses from deployment (update after your local deployment):

```bash
NEXT_PUBLIC_DSU_ADDRESS_LOCAL=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_VAULT_ADDRESS_LOCAL=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_MINTING_ADDRESS_LOCAL=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

### Sepolia (Chain ID: 11155111)

Update after deploying to Sepolia:

```bash
NEXT_PUBLIC_DSU_ADDRESS_SEPOLIA=0x...
NEXT_PUBLIC_VAULT_ADDRESS_SEPOLIA=0x...
NEXT_PUBLIC_MINTING_ADDRESS_SEPOLIA=0x...
```

### Mainnet (Chain ID: 1)

Update after deploying to Mainnet:

```bash
NEXT_PUBLIC_DSU_ADDRESS_MAINNET=0x...
NEXT_PUBLIC_VAULT_ADDRESS_MAINNET=0x...
NEXT_PUBLIC_MINTING_ADDRESS_MAINNET=0x...
```

## Quick Start

1. Copy this template to `.env.local`:

   ```bash
   cp ENV_SETUP.md .env.local
   ```

2. Edit `.env.local` and add your WalletConnect Project ID

3. Update contract addresses after deployment

4. Restart your dev server to apply changes
