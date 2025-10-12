# Getting Started with DSU Minting Interface

Quick start guide to get the minting interface running locally.

## Prerequisites

- Node.js 18+ and pnpm installed
- MetaMask or another Web3 wallet
- Anvil running (for local testing)

## 1. Install Dependencies

From the root of the monorepo:

```bash
pnpm install
```

Or from the app directory:

```bash
cd apps/app
pnpm install
```

## 2. Set Up Environment Variables

Create a `.env.local` file in `apps/app/`:

```bash
# Minimum required configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

**Get a WalletConnect Project ID:**

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign up / Log in
3. Create a new project
4. Copy the Project ID

**Optional: Add custom RPC URLs (recommended for production):**

```bash
NEXT_PUBLIC_MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
```

See `ENV_SETUP.md` for complete configuration options.

## 3. Deploy Contracts Locally

In a separate terminal, start Anvil:

```bash
cd apps/contracts
anvil
```

Keep this running. In another terminal, deploy contracts:

```bash
cd apps/contracts
forge script script/DeployAll.s.sol --broadcast --rpc-url http://127.0.0.1:8545
```

**Note the deployed addresses** from the output. Update your `.env.local` if they differ from defaults:

```bash
NEXT_PUBLIC_DSU_ADDRESS_LOCAL=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_VAULT_ADDRESS_LOCAL=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_MINTING_ADDRESS_LOCAL=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

## 4. Configure MetaMask for Anvil

1. **Add Anvil Network:**

   - Open MetaMask → Networks → Add Network → Add a network manually
   - **Network Name:** Anvil Local
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH
   - Save

2. **Import Test Account:**
   - MetaMask → Account menu → Import Account → Private Key
   - Paste Anvil's first account private key:
     ```
     0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d59bf3b7359
     ```
   - This account has 10,000 ETH and MINTER_ROLE by default

## 5. Start the Development Server

```bash
cd apps/app
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 6. Use the Interface

1. **Connect Wallet:**

   - Click "Connect Wallet" button
   - Select MetaMask
   - Make sure you're on "Anvil Local" network
   - Approve the connection

2. **Mint DSU Tokens:**

   - Enter recipient address (or use your own address)
   - Enter amount (e.g., 1000)
   - Click "Mint DSU Tokens"
   - Confirm transaction in MetaMask
   - Wait for confirmation ✅

3. **View Balance:**
   - Your balance updates automatically after minting
   - Total supply is displayed at the top

## Network Switching

The interface supports three networks:

### Anvil Local (Chain ID: 31337)

- For development and testing
- Free transactions
- Pre-funded test accounts
- Instant confirmations

### Sepolia (Chain ID: 11155111)

- Ethereum testnet
- Get free testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
- Deploy contracts first:
  ```bash
  forge script script/DeployAll.s.sol --broadcast --rpc-url $SEPOLIA_RPC_URL --verify
  ```
- Update `.env.local` with Sepolia contract addresses

### Mainnet (Chain ID: 1)

- Production Ethereum network
- Real ETH required for gas
- Use with caution
- Deploy contracts first
- Update `.env.local` with Mainnet contract addresses

**Switch networks in MetaMask** and the interface will automatically use the correct contract addresses.

## Common Issues

### "Please connect your wallet to mint DSU tokens"

- Click "Connect Wallet" button
- Approve the connection in MetaMask

### "User rejected transaction"

- Make sure you're on the correct network (Anvil Local for local testing)
- Try again and approve in MetaMask

### "Contract call reverted" or "Execution reverted"

- **Most common:** You don't have MINTER_ROLE
  - Use the deployer account (imported in step 4)
  - Or grant MINTER_ROLE to your address:
    ```bash
    cd apps/contracts
    cast send $DSU_ADDRESS "grantRole(bytes32,address)" \
      $(cast keccak "MINTER_ROLE()") YOUR_ADDRESS \
      --rpc-url http://127.0.0.1:8545 --private-key 0xac097...
    ```

### "Cannot read properties of undefined" or contract not found

- Verify Anvil is running
- Check contract addresses in `.env.local` match deployment output
- Restart the dev server after updating `.env.local`

### MetaMask shows "Unknown network"

- Add Anvil network following step 4
- Switch to Anvil Local network

### Balance not updating

- Refresh the page
- Check transaction was confirmed in MetaMask
- Verify you're looking at the correct account

## Project Structure

```
apps/app/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main minting page
│   └── globals.css         # Global styles
├── components/
│   ├── providers.tsx       # Wagmi & RainbowKit setup
│   └── mint-dsu.tsx        # Minting interface component
├── lib/
│   ├── wagmi.ts            # Wagmi config (networks)
│   └── contracts.ts        # Contract ABIs & addresses
└── .env.local              # Your configuration (create this)
```

## Next Steps

- ✅ Test minting tokens locally
- 📖 Read [MINTING_INTERFACE.md](./MINTING_INTERFACE.md) for detailed documentation
- 🎨 Customize the UI to match your brand
- 🧪 Deploy and test on Sepolia
- 🚀 Deploy to production when ready

## Additional Resources

- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://rainbowkit.com/)
- [Viem Documentation](https://viem.sh/)
- [Foundry Book](https://book.getfoundry.sh/)
- [MetaMask Developer Docs](https://docs.metamask.io/)

## Need Help?

1. Check [MINTING_INTERFACE.md](./MINTING_INTERFACE.md) for detailed documentation
2. Review [ENV_SETUP.md](./ENV_SETUP.md) for environment configuration
3. Check the browser console for errors
4. Verify Anvil is running and contracts are deployed
