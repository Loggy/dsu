import { defineConfig } from "@wagmi/cli/dist/esm/exports/index.js";
import { foundry } from "@wagmi/cli/dist/esm/exports/plugins.js";

export default defineConfig({
  out: "../app/lib/generated.ts",
  plugins: [
    foundry({
      project: ".",
      include: [
        "DSU.sol/**",
        "DSUVault.sol/**",
        "DSUMinting.sol/**",
        "DSUBlacklist.sol/**",
      ],
    }),
  ],
});
