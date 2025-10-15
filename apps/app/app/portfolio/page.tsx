'use client';

import { AppLayout } from '@/components/app-layout';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  DSU_ABI,
  VAULT_ABI,
  getDSUAddress,
  getVaultAddress,
} from '@/lib/contracts';

export default function PortfolioPage() {
  const { address, chain } = useAccount();
  const dsuAddress = chain?.id ? getDSUAddress(chain.id) : undefined;
  const vaultAddress = chain?.id ? getVaultAddress(chain.id) : undefined;

  // Read DSU balance
  const { data: dsuBalance } = useReadContract({
    address: dsuAddress,
    abi: DSU_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!dsuAddress,
      refetchInterval: 5000,
    },
  });

  // Read staked balance (vault shares)
  const { data: vaultShares } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!vaultAddress,
      refetchInterval: 5000,
    },
  });

  // Convert shares to assets
  const { data: stakedAssets } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'convertToAssets',
    args: vaultShares ? [vaultShares] : undefined,
    query: {
      enabled: !!vaultShares && !!vaultAddress,
      refetchInterval: 5000,
    },
  });

  const dsuBalanceFormatted = dsuBalance ? formatUnits(dsuBalance, 18) : '0';
  const stakedBalanceFormatted = stakedAssets
    ? formatUnits(stakedAssets, 18)
    : '0';
  const totalBalance =
    dsuBalance && stakedAssets
      ? formatUnits(dsuBalance + stakedAssets, 18)
      : dsuBalanceFormatted;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">
            Manage your DSU holdings and track your staking positions
          </p>
        </div>

        {!address ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">Connect Your Wallet</h2>
              <p className="text-muted-foreground">
                Connect your wallet to view your portfolio and manage your DSU
                tokens
              </p>
              <div className="flex justify-center pt-4">
                <ConnectButton />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Balance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Balance */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    Total Balance
                  </p>
                  <p className="text-3xl font-bold">
                    {Number(totalBalance).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">DSU</p>
                </div>
              </div>

              {/* Wallet Balance */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    Wallet Balance
                  </p>
                  <p className="text-3xl font-bold">
                    {Number(dsuBalanceFormatted).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">DSU</p>
                </div>
              </div>

              {/* Staked Balance */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    Staked Balance
                  </p>
                  <p className="text-3xl font-bold">
                    {Number(stakedBalanceFormatted).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">DSU</p>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mint DSU Card */}
              <div className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Mint DSU</h3>
                    <p className="text-muted-foreground text-sm">
                      Create new DSU tokens. Requires MINTER_ROLE permissions.
                    </p>
                  </div>
                  <Link
                    href="/mint"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Go to Mint
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Stake DSU Card */}
              <div className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Stake & Earn</h3>
                    <p className="text-muted-foreground text-sm">
                      Stake your DSU tokens in the vault to earn rewards over
                      time.
                    </p>
                  </div>
                  <Link
                    href="/earn"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Go to Earn
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Network Info */}
            <div className="bg-muted/30 border border-border rounded-xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Network</p>
                  <p className="font-semibold">{chain?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">DSU Contract</p>
                  <p className="font-mono text-xs truncate">{dsuAddress}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Vault Contract</p>
                  <p className="font-mono text-xs truncate">{vaultAddress}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
