import { type Address } from 'viem';

// Contract ABIs - key functions only for minting
export const DSU_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Vault ABI - ERC4626 staking vault functions
export const VAULT_ABI = [
  {
    inputs: [],
    name: 'asset',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalAssets',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'shares', type: 'uint256' }],
    name: 'convertToAssets',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'assets', type: 'uint256' }],
    name: 'convertToShares',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'assets', type: 'uint256' },
      { name: 'receiver', type: 'address' },
    ],
    name: 'deposit',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'shares', type: 'uint256' },
      { name: 'receiver', type: 'address' },
      { name: 'owner', type: 'address' },
    ],
    name: 'redeem',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'assets', type: 'uint256' },
      { name: 'receiver', type: 'address' },
      { name: 'owner', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'receiver', type: 'address' }],
    name: 'maxDeposit',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'maxWithdraw',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Contract addresses per network
export const CONTRACT_ADDRESSES = {
  // Anvil Local (Chain ID: 31337)
  31337: {
    dsu:
      (process.env.NEXT_PUBLIC_DSU_ADDRESS_LOCAL as Address) ||
      ('0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address),
    vault:
      (process.env.NEXT_PUBLIC_VAULT_ADDRESS_LOCAL as Address) ||
      ('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as Address),
    minting:
      (process.env.NEXT_PUBLIC_MINTING_ADDRESS_LOCAL as Address) ||
      ('0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as Address),
  },
  // Sepolia (Chain ID: 11155111)
  11155111: {
    dsu:
      (process.env.NEXT_PUBLIC_DSU_ADDRESS_SEPOLIA as Address) ||
      ('0x' as Address),
    vault:
      (process.env.NEXT_PUBLIC_VAULT_ADDRESS_SEPOLIA as Address) ||
      ('0x' as Address),
    minting:
      (process.env.NEXT_PUBLIC_MINTING_ADDRESS_SEPOLIA as Address) ||
      ('0x' as Address),
  },
  // Mainnet (Chain ID: 1)
  1: {
    dsu:
      (process.env.NEXT_PUBLIC_DSU_ADDRESS_MAINNET as Address) ||
      ('0x' as Address),
    vault:
      (process.env.NEXT_PUBLIC_VAULT_ADDRESS_MAINNET as Address) ||
      ('0x' as Address),
    minting:
      (process.env.NEXT_PUBLIC_MINTING_ADDRESS_MAINNET as Address) ||
      ('0x' as Address),
  },
} as const;

export type SupportedChainId = keyof typeof CONTRACT_ADDRESSES;

/**
 * Get contract addresses for the current chain
 */
export function getContractAddresses(chainId: number) {
  if (chainId in CONTRACT_ADDRESSES) {
    return CONTRACT_ADDRESSES[chainId as SupportedChainId];
  }
  // Default to local for unsupported chains
  return CONTRACT_ADDRESSES[31337];
}

/**
 * Get DSU contract address for a specific chain
 */
export function getDSUAddress(chainId: number): Address {
  const addresses = getContractAddresses(chainId);
  return addresses.dsu;
}

/**
 * Get Vault contract address for a specific chain
 */
export function getVaultAddress(chainId: number): Address {
  const addresses = getContractAddresses(chainId);
  return addresses.vault;
}
