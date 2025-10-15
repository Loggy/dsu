'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  DSU_ABI,
  VAULT_ABI,
  getDSUAddress,
  getVaultAddress,
} from '@/lib/contracts';

type TabType = 'stake' | 'unstake';

export default function EarnPage() {
  const [activeTab, setActiveTab] = useState<TabType>('stake');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { address, chain } = useAccount();
  const dsuAddress = chain?.id ? getDSUAddress(chain.id) : undefined;
  const vaultAddress = chain?.id ? getVaultAddress(chain.id) : undefined;

  // Read DSU balance
  const { data: dsuBalance, refetch: refetchDsuBalance } = useReadContract({
    address: dsuAddress,
    abi: DSU_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!dsuAddress,
    },
  });

  // Read vault shares
  const { data: vaultShares, refetch: refetchVaultShares } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!vaultAddress,
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
    },
  });

  // Read total assets in vault
  const { data: totalAssets } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'totalAssets',
    query: {
      enabled: !!vaultAddress,
    },
  });

  // Check allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: dsuAddress,
    abi: DSU_ABI,
    functionName: 'allowance',
    args: address && vaultAddress ? [address, vaultAddress] : undefined,
    query: {
      enabled: !!address && !!dsuAddress && !!vaultAddress,
    },
  });

  // Write contract hooks
  const {
    writeContract,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();

  // Wait for transaction
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Refetch balances after successful transaction
  if (isSuccess && txHash) {
    refetchDsuBalance();
    refetchVaultShares();
    refetchAllowance();
    setTxHash(undefined);
    setAmount('');
  }

  const handleApprove = async () => {
    if (!amount || !dsuAddress || !vaultAddress) return;

    try {
      const amountInWei = parseUnits(amount, 18);

      writeContract(
        {
          address: dsuAddress,
          abi: DSU_ABI,
          functionName: 'approve',
          args: [vaultAddress, amountInWei],
        },
        {
          onSuccess: (hash) => {
            setTxHash(hash);
          },
        }
      );
    } catch (error) {
      console.error('Approval error:', error);
    }
  };

  const handleStake = async () => {
    if (!amount || !vaultAddress || !address) return;

    try {
      const amountInWei = parseUnits(amount, 18);

      writeContract(
        {
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: 'deposit',
          args: [amountInWei, address],
        },
        {
          onSuccess: (hash) => {
            setTxHash(hash);
          },
        }
      );
    } catch (error) {
      console.error('Staking error:', error);
    }
  };

  const handleUnstake = async () => {
    if (!amount || !vaultAddress || !address) return;

    try {
      const amountInWei = parseUnits(amount, 18);

      writeContract(
        {
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: 'withdraw',
          args: [amountInWei, address, address],
        },
        {
          onSuccess: (hash) => {
            setTxHash(hash);
          },
        }
      );
    } catch (error) {
      console.error('Unstaking error:', error);
    }
  };

  const handleMaxClick = () => {
    if (activeTab === 'stake' && dsuBalance) {
      setAmount(formatUnits(dsuBalance, 18));
    } else if (activeTab === 'unstake' && stakedAssets) {
      setAmount(formatUnits(stakedAssets, 18));
    }
  };

  const needsApproval =
    activeTab === 'stake' &&
    amount &&
    allowance !== undefined &&
    parseUnits(amount, 18) > allowance;

  const isFormValid = amount && parseFloat(amount) > 0;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Earn</h1>
          <p className="text-muted-foreground">
            Stake your DSU tokens in the vault to earn rewards
          </p>
        </div>

        {!address ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <h2 className="text-2xl font-semibold">Connect Your Wallet</h2>
              <p className="text-muted-foreground">
                Connect your wallet to start earning rewards on your DSU tokens
              </p>
              <div className="flex justify-center pt-4">
                <ConnectButton />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Your Staked
                </p>
                <p className="text-2xl font-bold">
                  {stakedAssets
                    ? Number(formatUnits(stakedAssets, 18)).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 }
                      )
                    : '0'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">DSU</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Available to Stake
                </p>
                <p className="text-2xl font-bold">
                  {dsuBalance
                    ? Number(formatUnits(dsuBalance, 18)).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 }
                      )
                    : '0'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">DSU</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Total Staked in Vault
                </p>
                <p className="text-2xl font-bold">
                  {totalAssets
                    ? Number(formatUnits(totalAssets, 18)).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 }
                      )
                    : '0'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">DSU</p>
              </div>
            </div>

            {/* Staking Interface */}
            <div className="bg-card border border-border rounded-xl p-8">
              {/* Tabs */}
              <div className="flex gap-2 mb-6 bg-muted/30 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('stake')}
                  className={`flex-1 px-6 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'stake'
                      ? 'bg-background shadow-sm'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  Stake
                </button>
                <button
                  onClick={() => setActiveTab('unstake')}
                  className={`flex-1 px-6 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'unstake'
                      ? 'bg-background shadow-sm'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  Unstake
                </button>
              </div>

              {/* Amount Input */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium mb-2"
                  >
                    Amount (DSU)
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="amount"
                      type="number"
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                      disabled={isWriting || isMining}
                      step="0.01"
                      min="0"
                    />
                    <button
                      onClick={handleMaxClick}
                      className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors"
                      disabled={isWriting || isMining}
                    >
                      Max
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {activeTab === 'stake'
                      ? `Available: ${dsuBalance ? formatUnits(dsuBalance, 18) : '0'} DSU`
                      : `Staked: ${stakedAssets ? formatUnits(stakedAssets, 18) : '0'} DSU`}
                  </p>
                </div>

                {/* Action Buttons */}
                {activeTab === 'stake' ? (
                  needsApproval ? (
                    <button
                      onClick={handleApprove}
                      disabled={!isFormValid || isWriting || isMining}
                      className="w-full px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isWriting
                        ? 'Confirming...'
                        : isMining
                          ? 'Approving...'
                          : 'Approve DSU'}
                    </button>
                  ) : (
                    <button
                      onClick={handleStake}
                      disabled={!isFormValid || isWriting || isMining}
                      className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isWriting
                        ? 'Confirming...'
                        : isMining
                          ? 'Staking...'
                          : 'Stake DSU'}
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleUnstake}
                    disabled={!isFormValid || isWriting || isMining}
                    className="w-full px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isWriting
                      ? 'Confirming...'
                      : isMining
                        ? 'Unstaking...'
                        : 'Unstake DSU'}
                  </button>
                )}
              </div>

              {/* Transaction Status */}
              {txHash && (
                <div
                  className={`mt-6 p-4 rounded-lg ${
                    isSuccess
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-yellow-500/10 border border-yellow-500/20'
                  }`}
                >
                  <p className="text-sm font-medium mb-2">
                    {isSuccess
                      ? '✅ Transaction Successful!'
                      : '⏳ Transaction Pending...'}
                  </p>
                  <a
                    href={`${chain?.blockExplorers?.default.url}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {txHash}
                  </a>
                </div>
              )}

              {/* Error Display */}
              {writeError && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    <span className="font-semibold">Error:</span>{' '}
                    {writeError.message || 'Transaction failed'}
                  </p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">
                ℹ️ How Staking Works
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Stake your DSU tokens to earn rewards over time</li>
                <li>
                  • Rewards are distributed to stakers based on their share of
                  the vault
                </li>
                <li>
                  • You can unstake your tokens at any time (subject to cooldown
                  periods)
                </li>
                <li>
                  • Your staked tokens are represented as vault shares (ERC4626)
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
