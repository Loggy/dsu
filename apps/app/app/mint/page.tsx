'use client';

import { AppLayout } from '@/components/app-layout';
import { MintDSU } from '@/components/mint-dsu';

export default function MintPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Mint DSU</h1>
          <p className="text-muted-foreground">
            Create new DSU tokens. Requires MINTER_ROLE permissions.
          </p>
        </div>

        <MintDSU />
      </div>
    </AppLayout>
  );
}
