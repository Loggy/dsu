# DSU DApp

A comprehensive web3 application for managing DSU (Decentralized Stable Unit) tokens on Ethereum networks.

## 🚀 Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment (get WalletConnect Project ID first)
cp ENV_SETUP.md .env.local
# Edit .env.local with your WalletConnect Project ID

# 3. Start Anvil (in contracts directory)
cd ../contracts && anvil

# 4. Deploy contracts (in another terminal)
cd ../contracts && forge script script/DeployAll.s.sol --broadcast --rpc-url http://127.0.0.1:8545

# 5. Start dev server
cd ../app && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

**👉 See [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed setup instructions**

## Features

### 🏦 Portfolio Dashboard

- View total DSU holdings (wallet + staked)
- Track wallet and staked balances separately
- Quick access CTAs to Mint and Earn pages
- Network and contract information display

### 💰 Earn & Stake

- Stake DSU tokens into ERC4626 vault
- Unstake tokens with automatic cooldown handling
- View vault statistics and personal positions
- Automatic approval flow for staking
- Real-time balance updates

### 🪙 Mint Tokens

- Mint DSU tokens to any address (requires MINTER_ROLE)
- Transaction tracking and status updates
- Balance and total supply monitoring

### 🎨 Modern UI/UX

- ✅ **Multi-Network Support** - Anvil Local, Sepolia, Mainnet
- ✅ **Wallet Connection** - MetaMask, WalletConnect, Coinbase Wallet, and more
- ✅ **Real-time Updates** - Live balance and transaction tracking
- ✅ **Beautiful UI** - Modern, responsive design with dark/light mode
- ✅ **Type-Safe** - Full TypeScript support with Viem
- ✅ **Mobile First** - Fully responsive design

## Tech Stack

| Technology     | Purpose                     | Version |
| -------------- | --------------------------- | ------- |
| Next.js        | React framework             | 14.1    |
| Wagmi          | React hooks for Ethereum    | 2.x     |
| Viem           | TypeScript Ethereum library | 2.x     |
| RainbowKit     | Wallet connection UI        | 2.x     |
| TanStack Query | Data fetching & caching     | 5.x     |
| Tailwind CSS   | Styling                     | 3.4     |

## Application Structure

```
/                    → Redirects to /portfolio
/portfolio          → Main dashboard with balances and CTAs
/earn               → Staking interface (stake/unstake)
/mint               → Token minting (requires MINTER_ROLE)
```

## Documentation

- **[DAPP_STRUCTURE.md](./docs/DAPP_STRUCTURE.md)** - Complete app architecture guide
- **[GETTING_STARTED.md](./docs/GETTING_STARTED.md)** - Setup and first-time usage
- **[MINTING_INTERFACE.md](./docs/MINTING_INTERFACE.md)** - Complete feature documentation
- **[ENV_SETUP.md](./docs/ENV_SETUP.md)** - Environment variable configuration

## Project Structure

```
apps/app/
├── app/                      # Next.js App Router
│   ├── portfolio/           # Portfolio page
│   │   └── page.tsx
│   ├── earn/                # Staking page
│   │   └── page.tsx
│   ├── mint/                # Minting page
│   │   └── page.tsx
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Root redirect to portfolio
│   └── globals.css          # Global styles & Tailwind
│
├── components/              # React components
│   ├── header.tsx           # App header with nav
│   ├── app-layout.tsx       # Shared layout wrapper
│   ├── providers.tsx        # Wagmi & RainbowKit setup
│   └── mint-dsu.tsx         # Minting component
│
├── lib/                     # Core configuration
│   ├── wagmi.ts            # Network & wagmi config
│   └── contracts.ts        # ABIs & contract addresses
│
├── docs/                    # Documentation
│   └── DAPP_STRUCTURE.md   # App architecture
│
└── .env.local              # Your environment config (gitignored)
```

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript checks
```

## Supported Networks

### Anvil Local (Chain ID: 31337)

- **Purpose:** Local development and testing
- **RPC:** http://127.0.0.1:8545
- **Features:** Free transactions, instant confirmations, pre-funded accounts

### Sepolia (Chain ID: 11155111)

- **Purpose:** Public testnet
- **Faucet:** [sepoliafaucet.com](https://sepoliafaucet.com/)
- **Explorer:** [sepolia.etherscan.io](https://sepolia.etherscan.io/)

### Mainnet (Chain ID: 1)

- **Purpose:** Production
- **Explorer:** [etherscan.io](https://etherscan.io/)
- **⚠️ Caution:** Real ETH required

## Configuration

### Environment Variables

Create `.env.local`:

```bash
# Required
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Optional - Custom RPC endpoints
NEXT_PUBLIC_MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/...
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/...

# Optional - Contract addresses (defaults provided)
NEXT_PUBLIC_DSU_ADDRESS_LOCAL=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_DSU_ADDRESS_SEPOLIA=0x...
NEXT_PUBLIC_DSU_ADDRESS_MAINNET=0x...
```

See [ENV_SETUP.md](./ENV_SETUP.md) for complete configuration options.

## Key Components

### Mint DSU (`components/mint-dsu.tsx`)

Main interface component featuring:

- Network information display
- Balance and total supply tracking
- Minting form with validation
- Transaction status with explorer links
- Error handling and user feedback

### Providers (`components/providers.tsx`)

Configures the app with:

- Wagmi Provider (Ethereum state)
- TanStack Query Client (data fetching)
- RainbowKit Provider (wallet UI)
- Theme support (light/dark mode)

### Wagmi Config (`lib/wagmi.ts`)

Network configuration:

- Chain definitions (Anvil, Sepolia, Mainnet)
- RPC transports
- WalletConnect setup

### Contracts Config (`lib/contracts.ts`)

Contract configuration:

- DSU ABI (minimal for minting)
- Network-specific addresses
- Helper functions for address lookup

## Usage Example

### Basic Minting Flow

1. **Connect Wallet**

   ```
   Click "Connect Wallet" → Select MetaMask → Approve
   ```

2. **Enter Details**

   ```
   Recipient: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
   Amount: 1000
   ```

3. **Mint Tokens**
   ```
   Click "Mint DSU Tokens" → Confirm in wallet → Wait for confirmation
   ```

### Checking Balance

Balance updates automatically after:

- Connecting wallet
- Completing a mint transaction
- Switching accounts

## Important Notes

### MINTER_ROLE Required

Only accounts with `MINTER_ROLE` can mint tokens:

- **Local (Anvil):** Deployer account has all roles
- **Testnet/Mainnet:** Admin must grant role:

```bash
# Grant MINTER_ROLE to an address
cast send $DSU_ADDRESS "grantRole(bytes32,address)" \
  $(cast keccak "MINTER_ROLE()") $MINTER_ADDRESS \
  --rpc-url $RPC_URL --private-key $ADMIN_KEY
```

### Gas Costs

- **Anvil:** Free (no gas)
- **Sepolia:** Free testnet ETH from faucet
- **Mainnet:** Real ETH required (~$10-50 depending on gas prices)

## Troubleshooting

### Common Issues

| Issue                        | Solution                                 |
| ---------------------------- | ---------------------------------------- |
| "Please connect your wallet" | Click Connect Wallet button              |
| "User rejected transaction"  | Approve transaction in wallet            |
| "Contract call reverted"     | Check you have MINTER_ROLE               |
| "Cannot find contract"       | Verify contract addresses in .env.local  |
| "Insufficient funds"         | Get ETH from faucet (testnet) or add ETH |

See [GETTING_STARTED.md](./GETTING_STARTED.md#common-issues) for detailed troubleshooting.

## Customization

### Adding Networks

1. Edit `lib/wagmi.ts` to add chain
2. Edit `lib/contracts.ts` to add addresses
3. Add env vars for the network

### Styling

- Uses Tailwind CSS
- Dark mode supported via `next-themes`
- Customize in `globals.css` and component files
- Theme configured in `tailwind.config.js`

### Smart Contracts

The app integrates with two main contracts:

1. **DSU Token (ERC20)**: Standard token with minting capabilities
2. **DSU Vault (ERC4626)**: Staking vault for earning rewards

Contract addresses configured in `lib/contracts.ts` for each network.

### Additional Features to Consider

- Burn tokens functionality
- Direct transfer interface
- Approval management dashboard
- Transaction history
- Batch operations
- Governance features
- Analytics dashboard

## Development

### Type Safety

Full TypeScript support:

```typescript
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits, formatUnits, type Address } from 'viem';
```

### State Management

- **Wagmi:** Ethereum state (accounts, contracts)
- **TanStack Query:** Async data & caching
- **React Hooks:** Local component state

### Build & Deploy

```bash
# Development
pnpm dev

# Production build
pnpm build

# Test production build locally
pnpm build && pnpm start
```

Deploy to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any Node.js host**

## Resources

- [Wagmi Docs](https://wagmi.sh/) - React hooks for Ethereum
- [Viem Docs](https://viem.sh/) - TypeScript Ethereum library
- [RainbowKit Docs](https://rainbowkit.com/) - Wallet connection UI
- [Next.js Docs](https://nextjs.org/docs) - React framework
- [TanStack Query](https://tanstack.com/query) - Data fetching

## License

MIT
