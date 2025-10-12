# Quick Reference Card

One-page reference for DSU Minting Interface.

## 🚀 Instant Start

```bash
# Setup (once)
cd apps/app
echo "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id" > .env.local

# Run every time
cd apps/contracts && anvil &                          # Terminal 1
cd apps/contracts && forge script script/DeployAll.s.sol --broadcast --rpc-url http://127.0.0.1:8545  # Terminal 2
cd apps/app && pnpm dev                               # Terminal 3
```

Open http://localhost:3000

## 📁 File Map

```
apps/app/
├── lib/
│   ├── wagmi.ts      → Network config
│   └── contracts.ts  → ABIs & addresses
├── components/
│   ├── providers.tsx → Wagmi/RainbowKit setup
│   └── mint-dsu.tsx  → Main UI
└── app/
    ├── layout.tsx    → Root with providers
    └── page.tsx      → Home page
```

## 🔧 Key Config

### .env.local

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=xxx  # Required
NEXT_PUBLIC_DSU_ADDRESS_LOCAL=0x5FbDB...  # Optional (has default)
```

### networks.ts - Add Network

```typescript
import { polygon } from 'wagmi/chains';
// Add to chains array and transports
```

### contracts.ts - Add Address

```typescript
export const CONTRACT_ADDRESSES = {
  137: { dsu: '0x...' }, // Polygon
};
```

## 🎯 Core Hooks

```typescript
// Account & Chain
const { address, chain } = useAccount();

// Read Contract
const { data } = useReadContract({
  address: DSU_ADDRESS,
  abi: DSU_ABI,
  functionName: 'balanceOf',
  args: [address],
});

// Write Contract
const { writeContract } = useWriteContract();
writeContract({
  address: DSU_ADDRESS,
  abi: DSU_ABI,
  functionName: 'mint',
  args: [recipient, amount],
});

// Wait for Transaction
const { isSuccess } = useWaitForTransactionReceipt({ hash });
```

## 🌐 Networks

| Network | Chain ID | RPC                       | Explorer             |
| ------- | -------- | ------------------------- | -------------------- |
| Anvil   | 31337    | http://127.0.0.1:8545     | -                    |
| Sepolia | 11155111 | eth-sepolia.g.alchemy.com | sepolia.etherscan.io |
| Mainnet | 1        | eth-mainnet.g.alchemy.com | etherscan.io         |

## 🛠️ Common Commands

### Development

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm typecheck    # Check TypeScript
pnpm lint         # Run linter
```

### Contracts (from apps/contracts)

```bash
anvil                                    # Start local node
forge script script/DeployAll.s.sol --broadcast --rpc-url $RPC  # Deploy
cast send $DSU "mint(address,uint256)" $ADDR $AMOUNT --rpc-url $RPC --private-key $KEY  # Mint via CLI
```

### Grant MINTER_ROLE

```bash
cast send $DSU "grantRole(bytes32,address)" \
  $(cast keccak "MINTER_ROLE()") $MINTER \
  --rpc-url $RPC --private-key $ADMIN_KEY
```

## 📱 MetaMask Setup

**Anvil Network:**

- Name: Anvil Local
- RPC: http://127.0.0.1:8545
- Chain ID: 31337
- Symbol: ETH

**Import Test Account:**

```
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d59bf3b7359
```

## ❗ Troubleshooting

| Problem              | Solution                     |
| -------------------- | ---------------------------- |
| Can't connect wallet | Check network in MetaMask    |
| Contract not found   | Verify address in .env.local |
| Transaction reverted | Check MINTER_ROLE granted    |
| Import error         | Restart dev server           |
| Type error           | Run `pnpm typecheck`         |

## 📖 Documentation

- **GETTING_STARTED.md** - First time setup
- **MINTING_INTERFACE.md** - Complete guide
- **ENV_SETUP.md** - Environment config
- **IMPLEMENTATION_SUMMARY.md** - Technical details

## 🔗 External Links

- [Wagmi Docs](https://wagmi.sh)
- [RainbowKit Docs](https://rainbowkit.com)
- [Viem Docs](https://viem.sh)
- [WalletConnect Cloud](https://cloud.walletconnect.com)
- [Sepolia Faucet](https://sepoliafaucet.com)

## 💡 Tips

1. **Always test on Anvil first**
2. **Use testnet before mainnet**
3. **Keep private keys secure**
4. **Monitor gas prices on mainnet**
5. **Verify contracts on Etherscan**
6. **Use hardware wallets for production**
7. **Set up monitoring/alerts**
8. **Have backup RPC endpoints**

## 🎨 Customization Points

```typescript
// Styling
apps / app / app / globals.css; // Global styles
apps / app / tailwind.config.js; // Theme config

// Features
components / mint - dsu.tsx; // Add features here
lib / contracts.ts; // Add more contract functions

// Networks
lib / wagmi.ts; // Add/remove chains
```

## 🚢 Deploy Checklist

- [ ] Set WalletConnect Project ID
- [ ] Deploy contracts to network
- [ ] Update contract addresses
- [ ] Test on testnet
- [ ] Run `pnpm build`
- [ ] Deploy to Vercel/Netlify
- [ ] Set env vars in hosting platform
- [ ] Verify production build
- [ ] Test live deployment

## 📊 Performance

- **Build Time:** ~30s
- **Bundle Size:** ~298 KB (First Load JS)
- **Transaction Time:**
  - Anvil: Instant
  - Sepolia: ~15-30s
  - Mainnet: ~15-60s (varies by gas)

---

**Need Help?** Check the full docs or open an issue!
