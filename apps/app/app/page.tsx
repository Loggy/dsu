import { MintDSU } from '@/components/mint-dsu';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            DSU Minting Interface
          </h1>
          <p className="text-muted-foreground">
            Mint DSU tokens on Anvil Local, Sepolia, or Mainnet
          </p>
        </div>

        <MintDSU />
      </div>
    </main>
  );
}
