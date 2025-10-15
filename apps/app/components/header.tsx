'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract, useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { DSU_ABI, getDSUAddress } from '@/lib/contracts';

export function Header() {
  const pathname = usePathname();
  const { chain } = useAccount();
  const dsuAddress = chain?.id ? getDSUAddress(chain.id) : undefined;

  // Read total supply
  const { data: totalSupply } = useReadContract({
    address: dsuAddress,
    abi: DSU_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!dsuAddress,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  const navItems = [
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/earn', label: 'Earn' },
    { href: '/mint', label: 'Mint' },
  ];

  const isActivePath = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Branding and Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/portfolio" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <span className="text-primary-foreground font-bold text-lg">
                D
              </span>
            </div>
            <span className="font-bold text-xl tracking-tight">DSU</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath(item.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Total Supply and Connect Button */}
        <div className="flex items-center gap-4">
          {/* Total Supply Display */}
          {totalSupply !== undefined && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
              <span className="text-xs text-muted-foreground">
                Total Supply:
              </span>
              <span className="text-sm font-bold">
                {Number(formatUnits(totalSupply, 18)).toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits: 2,
                  }
                )}{' '}
                <span className="text-muted-foreground">DSU</span>
              </span>
            </div>
          )}

          {/* Connect Wallet */}
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border/40">
        <nav className="container mx-auto flex items-center justify-around px-4 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath(item.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
