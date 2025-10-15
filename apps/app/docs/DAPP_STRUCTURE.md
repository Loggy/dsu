# DSU DApp Structure

## Overview

The DSU DApp is a comprehensive web3 application for managing DSU tokens, including minting, staking, and portfolio management.

## Application Structure

### Pages

#### 1. Portfolio (`/portfolio`)

- **Purpose**: Main dashboard showing user's DSU holdings
- **Features**:
  - Total balance (wallet + staked)
  - Wallet balance
  - Staked balance
  - Quick action CTAs to Mint and Earn pages
  - Network and contract information

#### 2. Earn (`/earn`)

- **Purpose**: Staking interface for earning rewards
- **Features**:
  - Stake DSU tokens into the vault
  - Unstake DSU tokens from the vault
  - View staking statistics (your staked, available, total vault)
  - Automatic approval flow for staking
  - Real-time balance updates

#### 3. Mint (`/mint`)

- **Purpose**: Token minting interface for authorized users
- **Features**:
  - Mint DSU tokens to any address
  - Requires MINTER_ROLE permission
  - View user balance and total supply
  - Transaction tracking

### Components

#### Header (`components/header.tsx`)

- **Features**:
  - DSU branding with logo
  - Navigation menu (Portfolio, Earn, Mint)
  - Connect wallet button (RainbowKit)
  - Live total supply display
  - Mobile-responsive navigation

#### AppLayout (`components/app-layout.tsx`)

- **Purpose**: Shared layout wrapper for all pages
- **Features**:
  - Includes header
  - Consistent container styling
  - Responsive design

#### MintDSU (`components/mint-dsu.tsx`)

- **Purpose**: Reusable minting component
- **Features**:
  - Recipient address input
  - Amount input with max button
  - Transaction status tracking
  - Error handling

### Smart Contract Integration

#### Contract ABIs (`lib/contracts.ts`)

**DSU Token (ERC20)**:

- `mint()` - Create new tokens
- `balanceOf()` - Check user balance
- `totalSupply()` - Get total supply
- `approve()` - Approve token spending
- `allowance()` - Check approval amount

**Vault (ERC4626)**:

- `deposit()` - Stake tokens
- `withdraw()` - Unstake tokens
- `redeem()` - Redeem shares
- `balanceOf()` - Get vault shares
- `convertToAssets()` - Convert shares to tokens
- `convertToShares()` - Convert tokens to shares
- `totalAssets()` - Get total staked in vault

#### Supported Networks

- **Anvil Local** (Chain ID: 31337)
- **Sepolia Testnet** (Chain ID: 11155111)
- **Ethereum Mainnet** (Chain ID: 1)

## User Flows

### Staking Flow

1. Connect wallet
2. Navigate to Earn page
3. Enter amount to stake
4. If first time: Approve DSU spending
5. Stake DSU tokens
6. Receive vault shares representing staked position

### Unstaking Flow

1. Navigate to Earn page
2. Switch to "Unstake" tab
3. Enter amount to unstake
4. Confirm transaction
5. Receive DSU tokens back to wallet

### Minting Flow

1. Connect wallet with MINTER_ROLE
2. Navigate to Mint page
3. Enter recipient address and amount
4. Confirm transaction
5. DSU tokens created and sent to recipient

## Styling

- **Framework**: Tailwind CSS
- **Theme**: Dark/Light mode support via next-themes
- **Colors**: CSS variables for theming
- **Components**: Card-based design with consistent spacing
- **Mobile**: Fully responsive with mobile-first approach

## State Management

- **wagmi**: Web3 interactions and contract calls
- **TanStack Query**: Automatic data fetching and caching
- **RainbowKit**: Wallet connection and management
- **React Hooks**: Local component state

## Real-time Updates

- Balance queries refetch every 5-10 seconds
- Transaction receipts tracked automatically
- Balances refetch after successful transactions
- Total supply updates in header

## Error Handling

- User-friendly error messages
- Transaction failure handling
- Network switching prompts
- Loading states for all async operations

## Future Enhancements

- Historical transaction list
- Staking rewards calculator
- APY display for staking
- Multi-chain support expansion
- Governance features
- Analytics dashboard
