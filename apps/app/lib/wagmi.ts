import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { http } from 'wagmi';
import { defineChain } from 'viem';

// Define Anvil local chain
export const anvil = defineChain({
  id: 31337,
  name: 'Anvil Local',
  network: 'anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
  testnet: true,
});

// Get RPC URLs from environment or use defaults
const mainnetRpcUrl =
  process.env.NEXT_PUBLIC_MAINNET_RPC_URL ||
  'https://eth-mainnet.g.alchemy.com/v2/demo';
const sepoliaRpcUrl =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
  'https://eth-sepolia.g.alchemy.com/v2/demo';

// Get WalletConnect project ID
const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

if (projectId === 'YOUR_PROJECT_ID') {
  console.warn(
    '⚠️  WalletConnect Project ID is not set. Get one at https://cloud.walletconnect.com'
  );
}

// Configure wagmi
export const config = getDefaultConfig({
  appName: 'DSU Minting Interface',
  projectId,
  chains: [anvil, sepolia, mainnet],
  transports: {
    [anvil.id]: http(),
    [sepolia.id]: http(sepoliaRpcUrl),
    [mainnet.id]: http(mainnetRpcUrl),
  },
  ssr: true, // Enable server-side rendering support
});
