# DSU System Architecture

## Contract Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Deployment Sequence                         │
└─────────────────────────────────────────────────────────────────┘

1. DSUBlacklist
   │
   ├─ Constructor: (admin)
   └─ Roles: DEFAULT_ADMIN_ROLE, BLACKLIST_ROLE → admin

2. DSU (UUPS Upgradeable)
   │
   ├─ Implementation Contract
   │  └─ Constructor: (blacklist address)
   │
   └─ ERC1967Proxy
      ├─ Constructor: (implementation, initData)
      └─ Initialize: (admin, pauser, minter, upgrader)
         └─ Roles:
            ├─ DEFAULT_ADMIN_ROLE → admin
            ├─ PAUSER_ROLE → pauser
            ├─ MINTER_ROLE → minter
            └─ UPGRADER_ROLE → upgrader

3. DSUOFTAdapter
   │
   ├─ Constructor: (dsuProxy, lzEndpoint, owner)
   └─ Owner: admin

4. DSUSilo
   │
   └─ Constructor: (dsuProxy)

5. DSUVault (UUPS Upgradeable)
   │
   ├─ Implementation Contract
   │  └─ Constructor: (treasury)
   │
   └─ ERC1967Proxy
      ├─ Constructor: (implementation, initData)
      └─ Initialize: (dsuProxy, admin, name, symbol, silo, vesting, cooldown)
         ├─ Roles:
         │  ├─ DEFAULT_ADMIN_ROLE → admin
         │  └─ REWARDER_ROLE → rewarder
         └─ Links silo to vault
```

## Contract Relationships

```
┌────────────────────────────────────────────────────────────────┐
│                      System Overview                           │
└────────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │ DSUBlacklist│
                    └──────┬──────┘
                           │
                           │ checks blacklist
                           ▼
┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│ DSU Impl.    │◄───│  DSU Proxy  │────▶│ DSUOFTAdapter│
│ (Logic)      │    │  (ERC20)    │    │ (LayerZero)  │
└──────────────┘    └──────┬──────┘    └──────────────┘
                           │                    │
                           │ asset              │ cross-chain
                           ▼                    ▼
                    ┌─────────────┐
                    │ DSUVault    │
                    │ Proxy       │
                    │ (ERC4626)   │
                    └──────┬──────┘
                           │
                           │ cooldown storage
                           ▼
                    ┌─────────────┐
                    │  DSUSilo    │
                    └─────────────┘

┌──────────────┐
│ Vault Impl.  │◄─── upgradeable
│ (Logic)      │
└──────────────┘
```

## Token Flows

### Minting Flow

```
MINTER_ROLE
    │
    ├─► DSU.mint(to, amount)
    │
    └─► User receives DSU tokens
```

### Staking Flow

```
User (with DSU)
    │
    ├─► DSU.approve(vault, amount)
    │
    ├─► DSUVault.deposit(amount, receiver)
    │   │
    │   ├─► DSU transferred from user to vault
    │   │
    │   └─► Vault shares minted to receiver
    │
    └─► User receives sDSU (shares)
```

### Rewards Distribution Flow

```
REWARDER_ROLE (with DSU)
    │
    ├─► DSU.approve(vault, rewardAmount)
    │
    ├─► DSUVault.transferInRewards(rewardAmount)
    │   │
    │   ├─► DSU transferred from rewarder to vault
    │   │
    │   └─► Updates vesting schedule
    │       │
    │       └─► Rewards vest linearly over vesting period
    │
    └─► Vault share price increases over time
```

### Withdrawal Flow (No Cooldown)

```
User (with sDSU shares)
    │
    ├─► DSUVault.withdraw(assets, receiver, owner)
    │   │
    │   ├─► Burns user's shares
    │   │
    │   └─► Transfers DSU to receiver
    │
    └─► User receives DSU tokens
```

### Withdrawal Flow (With Cooldown)

```
User (with sDSU shares)
    │
    ├─► DSUVault.cooldownShares(shares, owner)
    │   │
    │   ├─► Burns user's shares
    │   │
    │   ├─► Transfers DSU to silo
    │   │
    │   └─► Records cooldown period
    │
    ├─► Wait for cooldown period to end
    │
    └─► DSUVault.unstake(receiver)
        │
        └─► Silo transfers DSU to receiver
```

### Cross-Chain Transfer Flow

```
User (on Chain A)
    │
    ├─► DSU.approve(oftAdapter, amount)
    │
    ├─► DSUOFTAdapter.send(...)
    │   │
    │   ├─► DSU transferred from user to adapter
    │   │
    │   └─► LayerZero message sent
    │
    └─► User receives DSU on Chain B
```

## Upgradeability Pattern (UUPS)

```
┌─────────────────────────────────────────────────────────┐
│                    Before Upgrade                       │
└─────────────────────────────────────────────────────────┘

        User Call
            │
            ▼
    ┌───────────────┐
    │  Proxy (V1)   │  ← All state stored here
    │               │
    │ storage:      │
    │ - balances    │
    │ - roles       │
    │ - config      │
    └───────┬───────┘
            │ delegatecall
            ▼
    ┌───────────────┐
    │ Implementation│
    │    (V1)       │  ← Logic only
    │               │
    │ - functions   │
    └───────────────┘

┌─────────────────────────────────────────────────────────┐
│                    After Upgrade                        │
└─────────────────────────────────────────────────────────┘

        User Call
            │
            ▼
    ┌───────────────┐
    │  Proxy (V1)   │  ← Same proxy, same state
    │               │
    │ storage:      │
    │ - balances    │
    │ - roles       │
    │ - config      │
    └───────┬───────┘
            │ delegatecall
            ▼
    ┌───────────────┐
    │ Implementation│  ← NEW logic
    │    (V2)       │
    │               │
    │ - new funcs   │
    │ - bug fixes   │
    └───────────────┘

    ┌───────────────┐
    │ Implementation│  ← Old logic (unused)
    │    (V1)       │
    └───────────────┘
```

## Access Control Matrix

| Contract          | Role               | Permissions                         | Default Holder |
| ----------------- | ------------------ | ----------------------------------- | -------------- |
| **DSUBlacklist**  | DEFAULT_ADMIN_ROLE | Manage all roles                    | admin          |
|                   | BLACKLIST_ROLE     | Add/remove addresses from blacklist | admin          |
| **DSU**           | DEFAULT_ADMIN_ROLE | Manage all roles                    | admin          |
|                   | PAUSER_ROLE        | Pause/unpause token transfers       | pauser         |
|                   | MINTER_ROLE        | Mint new tokens                     | minter         |
|                   | UPGRADER_ROLE      | Upgrade implementation              | upgrader       |
| **DSUVault**      | DEFAULT_ADMIN_ROLE | Manage all roles, set config        | admin          |
|                   | REWARDER_ROLE      | Transfer rewards to vault           | rewarder       |
|                   | UPGRADER_ROLE      | Upgrade implementation              | admin\*        |
| **DSUOFTAdapter** | Owner              | Configure cross-chain settings      | admin          |

\* Inherited from DEFAULT_ADMIN_ROLE

## Configuration Parameters

### DSU Token

- `name`: "Decentralized Stable Unit"
- `symbol`: "DSU"
- `decimals`: 18
- Upgradeable: ✅ (UUPS)

### DSUVault

- `name`: "Staked DSU"
- `symbol`: "sDSU"
- `decimals`: 18
- `MIN_SHARES`: 1e18
- `MAX_VESTING_PERIOD`: 7 days
- `MAX_COOLDOWN_DURATION`: 90 days
- Upgradeable: ✅ (UUPS)

### Deployment Defaults

- `initialVestingPeriod`: 7 days (configurable)
- `initialCooldownDuration`: 0 (disabled, configurable)

## Security Considerations

### Immutable References

- DSU blacklist address is immutable (set in constructor)
- DSUVault treasury address is immutable (set in constructor)

### Upgrade Safety

- UUPS pattern requires UPGRADER_ROLE
- Upgrades are authorized in contract logic, not proxy
- Cannot accidentally lock upgrade function

### Blacklist Enforcement

- DSU checks blacklist on every transfer
- Prevents blacklisted addresses from sending/receiving
- Vault inherits protection through DSU

### Economic Security

- Minimum shares requirement prevents inflation attacks
- Vesting period prevents immediate reward dumps
- Cooldown period provides additional security (optional)

### Role Separation

- Admin can't mint tokens (requires MINTER_ROLE)
- Minter can't upgrade contracts (requires UPGRADER_ROLE)
- Pauser can only pause, not mint or upgrade
- Rewarder can only add rewards, not configure

## Deployment Checklist

- [ ] Set up `.env` with all required variables
- [ ] Verify LayerZero endpoint address for target chain
- [ ] Compile contracts: `forge build`
- [ ] Test deployment locally with Anvil
- [ ] Deploy to testnet
- [ ] Verify contracts on block explorer
- [ ] Test basic operations (mint, transfer, stake)
- [ ] Grant necessary roles to operational addresses
- [ ] Configure OFT adapter for cross-chain (if needed)
- [ ] Set appropriate vesting period and cooldown
- [ ] Document all deployed addresses
- [ ] Set up monitoring and alerts
- [ ] Consider timelock for admin operations (mainnet)

## Emergency Procedures

### Pause Token Transfers

```bash
cast send $DSU_PROXY "pause()" --rpc-url $RPC --private-key $PAUSER_KEY
```

### Unpause Token Transfers

```bash
cast send $DSU_PROXY "unpause()" --rpc-url $RPC --private-key $PAUSER_KEY
```

### Blacklist Compromised Address

```bash
cast send $BLACKLIST "addToBlacklist(address)" $COMPROMISED_ADDR --rpc-url $RPC --private-key $ADMIN_KEY
```

### Emergency Upgrade

```bash
# 1. Deploy new implementation with fix
# 2. Upgrade immediately
cast send $DSU_PROXY "upgradeToAndCall(address,bytes)" $NEW_IMPL 0x --rpc-url $RPC --private-key $UPGRADER_KEY
```
