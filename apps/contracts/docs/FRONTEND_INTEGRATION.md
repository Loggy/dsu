# Frontend Integration Guide

How to connect your frontend to locally deployed DSU contracts.

## Quick Setup

### 1. Add Anvil Network to Your Frontend

**For wagmi/viem:**

```typescript
// config/chains.ts
import { defineChain } from "viem";

export const anvil = defineChain({
  id: 31337,
  name: "Anvil",
  network: "anvil",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
});

// Add to your wagmi config
import { createConfig, http } from "wagmi";
import { anvil } from "./chains";

export const config = createConfig({
  chains: [anvil],
  transports: {
    [anvil.id]: http(),
  },
});
```

**For ethers.js:**

```typescript
import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider("http://127.0.0.1:8545");
const network = await provider.getNetwork();
console.log("Connected to chain:", network.chainId); // 31337
```

### 2. Configure Contract Addresses

Create a contracts config file:

```typescript
// contracts/config.ts

// Copy these from your deployment output
export const CONTRACTS = {
  // Main contracts (use PROXY addresses!)
  dsu: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // DSU Proxy
  vault: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // Vault Proxy
  minting: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // DSUMinting

  // Supporting contracts
  blacklist: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  oftAdapter: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  silo: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",

  // Test tokens
  weth: "0x0165878A594ca255338adfa4d48449f69242Eb8F", // MockWETH
} as const;

export type ContractName = keyof typeof CONTRACTS;

// ABIs (import from contract artifacts)
export const ABIS = {
  dsu: [], // Import from DSU.json
  vault: [], // Import from DSUVault.json
  minting: [], // Import from DSUMinting.json
  weth: [], // Import from MockWETH.json
};
```

### 3. Load ABIs

**Option A: Direct Import (if using Vite/Next.js)**

```typescript
import DSU_ABI from "../../../contracts/out/DSU.sol/DSU.json";
import VAULT_ABI from "../../../contracts/out/DSUVault.sol/DSUVault.json";
import MINTING_ABI from "../../../contracts/out/DSUMinting.sol/DSUMinting.json";

export const ABIS = {
  dsu: DSU_ABI.abi,
  vault: VAULT_ABI.abi,
  minting: MINTING_ABI.abi,
};
```

**Option B: Generate TypeScript Types (recommended)**

```bash
# In contracts directory
forge build

# Install wagmi CLI
pnpm add -D @wagmi/cli

# Create wagmi.config.ts
cat > wagmi.config.ts << 'EOF'
import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'generated.ts',
  plugins: [
    foundry({
      project: '.',
      include: [
        'DSU.sol/**',
        'DSUVault.sol/**',
        'DSUMinting.sol/**',
      ],
    }),
  ],
})
EOF

# Generate types
pnpm wagmi generate
```

## Example: React Component with wagmi

```typescript
// components/DSUBalance.tsx
import { useAccount, useReadContract } from 'wagmi'
import { CONTRACTS } from '../contracts/config'
import { dsuAbi } from '../contracts/generated'

export function DSUBalance() {
  const { address } = useAccount()

  const { data: balance, isLoading } = useReadContract({
    address: CONTRACTS.dsu,
    abi: dsuAbi,
    functionName: 'balanceOf',
    args: [address],
  })

  if (isLoading) return <div>Loading balance...</div>

  return (
    <div>
      DSU Balance: {balance ? formatUnits(balance, 18) : '0'}
    </div>
  )
}
```

## Example: Minting DSU

```typescript
// components/MintDSU.tsx
import { useWriteContract, useWaitForTransaction } from 'wagmi'
import { parseUnits } from 'viem'
import { CONTRACTS } from '../contracts/config'
import { dsuAbi } from '../contracts/generated'

export function MintDSU() {
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isMining } = useWaitForTransaction({ hash })

  const handleMint = async () => {
    writeContract({
      address: CONTRACTS.dsu,
      abi: dsuAbi,
      functionName: 'mint',
      args: [
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // recipient
        parseUnits('1000', 18) // 1000 DSU
      ],
    })
  }

  return (
    <button onClick={handleMint} disabled={isMining}>
      {isMining ? 'Minting...' : 'Mint 1000 DSU'}
    </button>
  )
}
```

## Example: Staking in Vault

```typescript
// components/StakeVault.tsx
import { useState } from 'react'
import { useWriteContract, useWaitForTransaction } from 'wagmi'
import { parseUnits } from 'viem'
import { CONTRACTS } from '../contracts/config'
import { dsuAbi, vaultAbi } from '../contracts/generated'

export function StakeVault() {
  const [amount, setAmount] = useState('')
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading } = useWaitForTransaction({ hash })

  const handleApprove = async () => {
    writeContract({
      address: CONTRACTS.dsu,
      abi: dsuAbi,
      functionName: 'approve',
      args: [CONTRACTS.vault, parseUnits(amount, 18)],
    })
  }

  const handleDeposit = async () => {
    writeContract({
      address: CONTRACTS.vault,
      abi: vaultAbi,
      functionName: 'deposit',
      args: [
        parseUnits(amount, 18),
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' // receiver
      ],
    })
  }

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount to stake"
      />
      <button onClick={handleApprove} disabled={isLoading}>
        Approve
      </button>
      <button onClick={handleDeposit} disabled={isLoading}>
        Stake
      </button>
    </div>
  )
}
```

## MetaMask Configuration

### Add Anvil Network

1. Open MetaMask
2. Click network dropdown
3. Add network manually:
   - **Network Name:** Anvil Local
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH

### Import Test Account

1. Click account icon
2. Import Account
3. Select "Private Key"
4. Paste: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d59bf3b7359`

This gives you 10,000 ETH for testing!

## Useful Hooks

### Read DSU Balance

```typescript
function useDSUBalance(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.dsu,
    abi: dsuAbi,
    functionName: "balanceOf",
    args: [address],
    enabled: !!address,
  });
}
```

### Read Vault Shares

```typescript
function useVaultShares(address?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.vault,
    abi: vaultAbi,
    functionName: "balanceOf",
    args: [address],
    enabled: !!address,
  });
}
```

### Check Allowance

```typescript
function useDSUAllowance(owner?: `0x${string}`, spender?: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.dsu,
    abi: dsuAbi,
    functionName: "allowance",
    args: [owner, spender],
    enabled: !!owner && !!spender,
  });
}
```

## Environment Variables

```bash
# .env.local (frontend)
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545

# Contract addresses (from deployment)
NEXT_PUBLIC_DSU_ADDRESS=0x...
NEXT_PUBLIC_VAULT_ADDRESS=0x...
NEXT_PUBLIC_MINTING_ADDRESS=0x...
```

## Complete Example: Full Staking Flow

```typescript
// hooks/useStaking.ts
import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransaction } from "wagmi";
import { parseUnits } from "viem";
import { CONTRACTS } from "../contracts/config";
import { dsuAbi, vaultAbi } from "../contracts/generated";

export function useStaking() {
  const { address } = useAccount();
  const [step, setStep] = useState<
    "idle" | "approving" | "staking" | "success"
  >("idle");
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading } = useWaitForTransaction({
    hash,
    onSuccess: () => {
      if (step === "approving") {
        setStep("staking");
      } else if (step === "staking") {
        setStep("success");
      }
    },
  });

  const stake = async (amount: string) => {
    const amountWei = parseUnits(amount, 18);

    // Step 1: Approve
    setStep("approving");
    await writeContract({
      address: CONTRACTS.dsu,
      abi: dsuAbi,
      functionName: "approve",
      args: [CONTRACTS.vault, amountWei],
    });

    // Step 2: Deposit (will be called after approval success)
    // Wait for approval tx to complete, then:
    setTimeout(async () => {
      await writeContract({
        address: CONTRACTS.vault,
        abi: vaultAbi,
        functionName: "deposit",
        args: [amountWei, address],
      });
    }, 1000);
  };

  return { stake, step, isLoading };
}
```

## Testing in Browser Console

Open browser console and test directly:

```javascript
// Get contract instance
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const dsu = new ethers.Contract(DSU_ADDRESS, DSU_ABI, signer);

// Check balance
const balance = await dsu.balanceOf(await signer.getAddress());
console.log("Balance:", ethers.formatUnits(balance, 18));

// Mint tokens (if you're the minter)
const tx = await dsu.mint(
  await signer.getAddress(),
  ethers.parseUnits("1000", 18)
);
await tx.wait();
console.log("Minted!");
```

## Troubleshooting

### "User rejected transaction"

- Make sure you're connected to Anvil (chain 31337)
- Check MetaMask is on the right network

### "Insufficient funds"

- Import one of Anvil's funded accounts
- Each has 10,000 ETH

### "Contract call reverted"

- Check you're calling the right function
- Verify you have the necessary roles/permissions
- Use `-vvvv` flag with cast to see detailed errors

### "Cannot read properties of undefined"

- Verify contract addresses are correct
- Make sure contracts are deployed (check Anvil output)
- Reload the page after deploying new contracts

## Next Steps

1. ✅ Set up Anvil network in MetaMask
2. ✅ Import test account
3. ✅ Configure contract addresses
4. ✅ Generate TypeScript types
5. 🎨 Build your UI components
6. 🧪 Test all flows
7. 🚀 Deploy to testnet when ready

## Resources

- [wagmi Documentation](https://wagmi.sh/)
- [viem Documentation](https://viem.sh/)
- [Foundry Book](https://book.getfoundry.sh/)
- [MetaMask Developer Docs](https://docs.metamask.io/)
