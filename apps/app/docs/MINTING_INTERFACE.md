# DSU Minting Interface

A modern, responsive web interface for minting DSU tokens on Anvil Local, Sepolia, and Mainnet networks.

## Features

- 🔗 **Multi-Network Support**: Seamlessly switch between Anvil Local (31337), Sepolia (11155111), and Mainnet (1)
- 🦊 **Wallet Connection**: Connect with MetaMask, WalletConnect, Coinbase Wallet, and more via RainbowKit
- 🎨 **Modern UI**: Beautiful, responsive interface with dark mode support
- 🔄 **Real-time Updates**: Live balance and transaction status updates
- 🔒 **Type-Safe**: Built with TypeScript and Viem for type safety
- ⚡ **Fast**: Optimized with wagmi hooks and TanStack Query

## Tech Stack

- **Next.js 14**: React framework with App Router
- **Wagmi v2**: React hooks for Ethereum
- **Viem v2**: TypeScript interface for Ethereum
- **RainbowKit**: Beautiful wallet connection UI
- **TanStack Query**: Powerful data fetching and caching
- **Tailwind CSS**: Utility-first CSS framework

## Quick Start

### 1. Install Dependencies

Already installed in this project:

```bash
cd apps/app
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```bash
# Required: Get from https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Optional: Use custom RPC URLs
NEXT_PUBLIC_MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# Contract addresses (update after deployment)
NEXT_PUBLIC_DSU_ADDRESS_LOCAL=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_VAULT_ADDRESS_LOCAL=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_MINTING_ADDRESS_LOCAL=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

See `ENV_SETUP.md` for complete details.

### 3. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

### Testing Locally with Anvil

1. **Start Anvil** (in contracts directory):

   ```bash
   cd apps/contracts
   anvil
   ```

2. **Deploy Contracts**:

   ```bash
   forge script script/DeployAll.s.sol --broadcast --rpc-url http://127.0.0.1:8545
   ```

3. **Configure MetaMask**:

   - Network: Anvil Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency: ETH

4. **Import Test Account**:
   Use Anvil's first account private key:

   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d59bf3b7359
   ```

   This account has MINTER_ROLE by default.

5. **Mint Tokens**:
   - Connect your wallet (switch to Anvil network)
   - Enter recipient address
   - Enter amount (e.g., 1000)
   - Click "Mint DSU Tokens"

### Testing on Sepolia

1. **Deploy to Sepolia**:

   ```bash
   cd apps/contracts
   forge script script/DeployAll.s.sol --broadcast --rpc-url $SEPOLIA_RPC_URL --verify
   ```

2. **Update Contract Addresses**:
   Update `.env.local` with deployed addresses

3. **Get Testnet ETH**:

   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Get test ETH for gas

4. **Connect & Mint**:
   - Switch MetaMask to Sepolia
   - Connect wallet
   - Mint tokens

## Project Structure

```
apps/app/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main minting page
│   └── globals.css         # Global styles
├── components/
│   ├── providers.tsx       # RainbowKit & Wagmi providers
│   └── mint-dsu.tsx        # Main minting component
├── lib/
│   ├── wagmi.ts            # Wagmi configuration
│   └── contracts.ts        # Contract ABIs and addresses
└── ENV_SETUP.md            # Environment setup guide
```

## Key Components

### `lib/wagmi.ts`

Configures wagmi with three networks:

- Anvil Local (31337)
- Sepolia (11155111)
- Mainnet (1)

### `lib/contracts.ts`

Contains:

- DSU contract ABI (minimal for minting)
- Network-specific contract addresses
- Helper functions for address lookup

### `components/providers.tsx`

Wraps the app with:

- WagmiProvider
- QueryClientProvider (TanStack Query)
- RainbowKitProvider (with theme support)

### `components/mint-dsu.tsx`

Main minting interface with:

- Wallet connection
- Network information display
- Balance and total supply display
- Minting form
- Transaction status tracking
- Error handling

## Hooks Used

### From wagmi

- `useAccount()` - Get connected wallet address and chain
- `useWriteContract()` - Write to smart contract
- `useWaitForTransactionReceipt()` - Wait for transaction confirmation
- `useReadContract()` - Read contract state

### From viem

- `parseUnits()` - Convert human-readable amounts to Wei
- `formatUnits()` - Convert Wei to human-readable amounts

## Features Explained

### Network Detection

The interface automatically detects the connected network and uses the appropriate contract addresses:

```typescript
const { chain } = useAccount();
const dsuAddress = chain?.id ? getDSUAddress(chain.id) : undefined;
```

### Balance Display

Shows the connected user's DSU balance in real-time:

```typescript
const { data: balance } = useReadContract({
  address: dsuAddress,
  abi: DSU_ABI,
  functionName: 'balanceOf',
  args: [address],
});
```

### Transaction Tracking

Tracks transaction status from submission to confirmation:

```typescript
const { writeContract } = useWriteContract();
const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });
```

## Important Notes

### MINTER_ROLE Required

To mint DSU tokens, the connected wallet must have `MINTER_ROLE`:

- **Anvil**: Deployer account has all roles
- **Testnet/Mainnet**: Grant role via contract admin:
  ```bash
  cast send $DSU_ADDRESS "grantRole(bytes32,address)" \
    $(cast keccak "MINTER_ROLE()") $MINTER_ADDRESS \
    --rpc-url $RPC_URL --private-key $ADMIN_KEY
  ```

### Gas Considerations

- **Local**: No gas needed
- **Sepolia**: Use testnet ETH from faucet
- **Mainnet**: Real ETH required, gas costs apply

## Troubleshooting

### "User rejected transaction"

- Make sure you're on the correct network
- Check MetaMask is unlocked

### "Insufficient funds"

- Ensure you have enough ETH for gas
- For Anvil, import a funded test account

### "Contract call reverted"

- Verify you have MINTER_ROLE
- Check the contract address is correct
- Ensure the contract is deployed

### "Cannot read properties of undefined"

- Verify contract addresses in `.env.local`
- Check Anvil is running (for local testing)
- Reload the page after deploying new contracts

## Customization

### Adding More Networks

Edit `lib/wagmi.ts`:

```typescript
import { polygon } from 'wagmi/chains';

export const config = getDefaultConfig({
  chains: [anvil, sepolia, mainnet, polygon],
  transports: {
    // ... add polygon transport
    [polygon.id]: http('https://polygon-rpc.com'),
  },
});
```

Then update `lib/contracts.ts` with Polygon addresses.

### Styling

The interface uses Tailwind CSS. Customize in:

- `globals.css` for global styles
- Component files for component-specific styling
- `tailwind.config.js` for theme configuration

### Adding Features

Common additions:

- Burn tokens
- Transfer tokens
- Approve spending
- View transaction history
- Multiple recipients (batch minting)

## Resources

- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [RainbowKit Documentation](https://rainbowkit.com/)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT
