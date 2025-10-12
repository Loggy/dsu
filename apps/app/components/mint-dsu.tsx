'use client';

import { useState } from 'react';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { DSU_ABI, getDSUAddress } from '@/lib/contracts';

export function MintDSU() {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { address, chain } = useAccount();
  const dsuAddress = chain?.id ? getDSUAddress(chain.id) : undefined;

  // Write contract hook for minting
  const {
    writeContract,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Read user's DSU balance
  const { data: balance } = useReadContract({
    address: dsuAddress,
    abi: DSU_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!dsuAddress,
    },
  });

  // Read total supply
  const { data: totalSupply } = useReadContract({
    address: dsuAddress,
    abi: DSU_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!dsuAddress,
    },
  });

  const handleMint = async () => {
    if (!recipientAddress || !amount || !dsuAddress) return;

    try {
      const amountInWei = parseUnits(amount, 18);

      writeContract(
        {
          address: dsuAddress,
          abi: DSU_ABI,
          functionName: 'mint',
          args: [recipientAddress as `0x${string}`, amountInWei],
        },
        {
          onSuccess: (hash) => {
            setTxHash(hash);
          },
        }
      );
    } catch (error) {
      console.error('Minting error:', error);
    }
  };

  const handleSetMaxSupply = () => {
    setAmount('1000000'); // Example: 1M DSU
  };

  const isFormValid = recipientAddress && amount && parseFloat(amount) > 0;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-card rounded-lg shadow-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Mint DSU Tokens</h2>
          <ConnectButton />
        </div>

        {!address ? (
          <div className="text-center py-8 text-muted-foreground">
            Please connect your wallet to mint DSU tokens
          </div>
        ) : (
          <>
            {/* Network Info */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Network</p>
                  <p className="font-semibold">{chain?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Chain ID</p>
                  <p className="font-semibold">{chain?.id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">DSU Contract</p>
                  <p className="font-mono text-xs truncate">
                    {dsuAddress || 'Not deployed'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Your Balance</p>
                  <p className="font-semibold">
                    {balance ? formatUnits(balance, 18) : '0'} DSU
                  </p>
                </div>
              </div>
            </div>

            {/* Total Supply */}
            {totalSupply !== undefined && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Total Supply:{' '}
                  <span className="font-bold">
                    {formatUnits(totalSupply, 18)} DSU
                  </span>
                </p>
              </div>
            )}

            {/* Mint Form */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="recipient"
                  className="block text-sm font-medium mb-2"
                >
                  Recipient Address
                </label>
                <input
                  id="recipient"
                  type="text"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full px-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                  disabled={isWriting || isMining}
                />
              </div>

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
                    placeholder="1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 px-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                    disabled={isWriting || isMining}
                    step="0.01"
                    min="0"
                  />
                  <button
                    onClick={handleSetMaxSupply}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors"
                    disabled={isWriting || isMining}
                  >
                    Max
                  </button>
                </div>
              </div>

              <button
                onClick={handleMint}
                disabled={!isFormValid || isWriting || isMining}
                className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isWriting
                  ? 'Confirming...'
                  : isMining
                    ? 'Minting...'
                    : 'Mint DSU Tokens'}
              </button>
            </div>

            {/* Transaction Status */}
            {txHash && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  isSuccess
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-yellow-500/10 border border-yellow-500/20'
                }`}
              >
                <p className="text-sm font-medium mb-2">
                  {isSuccess
                    ? '✅ Successfully Minted!'
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
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  <span className="font-semibold">Error:</span>{' '}
                  {writeError.message || 'Transaction failed'}
                </p>
              </div>
            )}

            {/* Helper Text */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 <span className="font-semibold">Note:</span> You must have
                the MINTER_ROLE to mint DSU tokens. On Anvil local network, use
                the deployer account which has all roles by default.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
