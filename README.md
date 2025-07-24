# Subgraph

## Description

This subgraph indexes and exposes data a decentralized platform. The subgraph provides comprehensive GraphQL API access to:

* **Market Data**: Real-time information about lending markets
* **Position Tracking**: User positions, balances, and historical activity
* **Financial Metrics**: Interest rates, utilization, collateralization ratios
* **Transaction History**: All protocol interactions and their details
* **Analytics**: Usage statistics and historical snapshots

### Key Features

* **Real-time Data**: Live market conditions and user positions
* **Historical Analysis**: Time-series data for market trends
* **Comprehensive Coverage**: All protocol interactions tracked
* **Flexible Querying**: GraphQL interface for efficient data access

## Architecture

The subgraph is built around a hierarchical structure with the Protocol as the root entity:

```
Protocol
├── Markets (individual lending markets)
│   ├── Positions (user positions within markets)
│   ├── Configurations (market parameters)
│   └── Interactions (all user activities)
├── ConfigControllers (governance and configuration)
└── Accounts (user addresses and metadata)
```

### Core Components

1. **Protocol Layer**: Top-level aggregation and statistics
2. **Market Layer**: Individual lending market data
3. **Position Layer**: User-specific positions and balances
4. **Interaction Layer**: Transaction-level details
5. **Configuration Layer**: Protocol parameters and governance

## Core Entities

### Protocol

The root entity representing the entire Compound Protocol instance.

```graphql
type Protocol @entity(immutable: false) {
  id: Bytes!                           # Configurator proxy address
  sandboxController: Bytes!            # Sandbox controller address
  marketFactory: Bytes!                # Market factory address
  configControllerFactory: Bytes!      # Config controller factory address
  markets: [Market!]!                  # All markets in the protocol
  accounting: ProtocolAccounting!      # Current protocol-wide accounting
  cumulativeUsage: Usage!              # Cumulative usage statistics
  
  # Historical data (derived fields)
  hourlyUsage: [ProtocolHourlyUsage!]!
  dailyUsage: [ProtocolDailyUsage!]!
  hourlyProtocolAccounting: [HourlyProtocolAccounting!]!
  dailyProtocolAccounting: [DailyProtocolAccounting!]!
  weeklyProtocolAccounting: [WeeklyProtocolAccounting!]!
}
```

**Key Properties:**

* `id`: Unique identifier using the configurator proxy address
* `markets`: Collection of all lending markets
* `accounting`: Current financial state of the entire protocol
* `cumulativeUsage`: Aggregate usage statistics across all markets

### Market

Represents an individual lending market for a specific base asset.

```graphql
type Market @entity(immutable: true) {
  id: Bytes!                          # Comet proxy address
  comet: Comet!                       # Comet contract reference
  protocol: Protocol!                 # Parent protocol
  creationBlockNumber: BigInt!        # Block when market was created
  
  configuration: MarketConfiguration! # Current market configuration
  accounting: MarketAccounting!       # Current market accounting
  cumulativeUsage: Usage!            # Market usage statistics
  
  # User positions
  positions: [Position!]!
  
  # Interaction history
  supplyBaseInteractions: [SupplyBaseInteraction!]!
  withdrawBaseInteractions: [WithdrawBaseInteraction!]!
  absorbDebtInteractions: [AbsorbDebtInteraction!]!
  supplyCollateralInteractions: [SupplyCollateralInteraction!]!
  withdrawCollateralInteractions: [WithdrawCollateralInteraction!]!
  transferCollateralInteractions: [TransferCollateralInteraction!]!
  absorbCollateralInteractions: [AbsorbCollateralInteraction!]!
  buyCollateralInteractions: [BuyCollateralInteraction!]!
  withdrawReservesInteractions: [WithdrawReservesInteraction!]!
  
  # Historical snapshots
  hourlyUsage: [MarketHourlyUsage!]!
  dailyUsage: [MarketDailyUsage!]!
  configurationSnapshots: [MarketConfigurationSnapshot!]!
  hourlyMarketAccounting: [HourlyMarketAccounting!]!
  dailyMarketAccounting: [DailyMarketAccounting!]!
  weeklyMarketAccounting: [WeeklyMarketAccounting!]!
}
```

**Key Properties:**

* `id`: Comet proxy address serves as unique identifier
* `configuration`: Current market parameters (interest rates, collateral factors, etc.)
* `accounting`: Real-time financial state (supply, borrow, reserves)
* `positions`: All user positions in this market

### Position

Represents a user's position within a specific market.

```graphql
type Position @entity(immutable: true) {
  id: Bytes!                          # Market address + owner address
  creationBlockNumber: BigInt!        # Block when position was created
  market: Market!                     # Market this position belongs to
  account: Account!                   # Owner of the position
  
  accounting: PositionAccounting!     # Current position accounting
  
  # Interaction history
  supplyBaseInteractions: [SupplyBaseInteraction!]!
  withdrawBaseInteractions: [WithdrawBaseInteraction!]!
  transferFromBaseInteractions: [TransferBaseInteraction!]!
  transferToBaseInteractions: [TransferBaseInteraction!]!
  absorbDebtInteractions: [AbsorbDebtInteraction!]!
  supplyCollateralInteractions: [SupplyCollateralInteraction!]!
  withdrawCollateralInteractions: [WithdrawCollateralInteraction!]!
  transferFromCollateralInteractions: [TransferCollateralInteraction!]!
  transferToCollateralInteractions: [TransferCollateralInteraction!]!
  absorbCollateralInteractions: [AbsorbCollateralInteraction!]!
  rewardsClaimedInteractions: [ClaimRewardsInteraction!]!
  
  # Historical snapshots
  positionAccountingSnapshots: [PositionAccountingSnapshot!]
}
```

**Key Properties:**

* `id`: Composite key of market address and owner address
* `accounting`: Current balances, collateral, and cumulative statistics
* `market`: Reference to the market this position belongs to
* `account`: Reference to the account that owns this position

### Account

Represents a user account that can have positions across multiple markets.

```graphql
type Account @entity(immutable: false) {
  id: Bytes!                          # Address
  creationBlockNumber: BigInt!        # Block when account was first seen
  address: Bytes!                     # Account address
  
  # Derived fields
  positions: [Position!]!             # All positions owned by this account
  rewardsClaimedInteractions: [ClaimRewardsInteraction!]!
}
```

## Configuration System

The configuration system manages market parameters and governance settings.

### MarketConfiguration

Defines the parameters for a lending market.

```graphql
type MarketConfiguration @entity(immutable: false) {
  id: Bytes!                          # Market proxy address
  market: Market!                     # Associated market
  lastConfigurationUpdateBlockNumber: BigInt!
  
  # Market metadata
  name: String!                       # Market name
  symbol: String!                     # ERC20 symbol
  
  # Interest rate model parameters
  supplyKink: BigDecimal!             # Supply rate kink (utilization %)
  supplyPerSecondInterestRateSlopeLow: BigInt!
  supplyPerSecondInterestRateSlopeHigh: BigInt!
  supplyPerSecondInterestRateBase: BigInt!
  
  borrowKink: BigDecimal!             # Borrow rate kink (utilization %)
  borrowPerSecondInterestRateSlopeLow: BigInt!
  borrowPerSecondInterestRateSlopeHigh: BigInt!
  borrowPerSecondInterestRateBase: BigInt!
  
  # Liquidation parameters
  storeFrontPriceFactor: BigInt!      # Liquidation discount factor
  
  # Rewards parameters
  baseTrackingSupplySpeed: BigInt!    # Supply reward speed
  baseTrackingBorrowSpeed: BigInt!    # Borrow reward speed
  baseMinForRewards: BigInt!          # Minimum balance for rewards
  
  # Market limits
  baseBorrowMin: BigInt!              # Minimum borrow amount
  targetReserves: BigInt!             # Target reserve level
  
  # Tokens
  baseToken: BaseToken!               # Base token configuration
  collateralTokens: [CollateralToken!]! # Collateral token configurations
}
```

### ConfigController

Manages governance and configuration updates.

```graphql
type ConfigController @entity(immutable: false) {
  id: Bytes!                          # Controller address
  curator: Bytes                      # Curator address
  owner: Bytes!                       # Owner address
  guardian: Bytes                     # Guardian address
  marketFactory: Bytes!               # Market factory address
  
  # Configuration parameters
  curatorFee: BigInt!                 # Curator fee percentage
  name: String!                       # Controller name
  curatorProposalDuration: BigInt!    # Curator proposal duration
  proposalDuration: BigInt!           # Standard proposal duration
  
  updatedAt: BigInt!
  createdAt: BigInt!
}
```

## Additional System Entities

### Comet

Represents the core smart contract for each market, containing market-specific logic and state.

```graphql
type Comet @entity(immutable: false) {
  id: Bytes!                          # Contract address
  configController: ConfigController! # Associated configuration controller
  market: Market!                     # Associated market
  
  updatedAt: BigInt!                  # Last update timestamp
  createdAt: BigInt!                  # Creation timestamp
}
```

**Key Properties:**

* `id`: The contract address of the Comet instance
* `configController`: Reference to the governance controller managing this market
* `market`: One-to-one relationship with the Market entity
* `updatedAt`/`createdAt`: Timestamp tracking for entity lifecycle

### User

Represents individual user data within the Comet system, tracking basic user information and principal balances.

```graphql
type User @entity(immutable: false) {
  id: Bytes!                          # User identifier
  principal: BigInt!                  # User's principal balance
  userAddress: Bytes!                 # User's wallet address
  comet: Comet!                       # Associated Comet contract
  
  updatedAt: BigInt!                  # Last update timestamp
  createdAt: BigInt!                  # Creation timestamp
}
```

**Key Properties:**

* `id`: Unique identifier for the user
* `principal`: Current principal balance (positive for supply, negative for borrow)
* `userAddress`: The user's wallet address
* `comet`: Reference to the Comet contract the user is interacting with

### WhitelistedCollateral

Defines approved collateral assets and their risk parameters for liquidation and borrowing.

```graphql
type WhitelistedCollateral @entity(immutable: true) {
  id: Bytes!                          # Collateral token address
  priceFeed: Bytes!                   # Price feed contract address
  decimals: BigInt!                   # Token decimals
  
  # Borrow collateral factors
  maxBorrowCollateralFactor: BigInt!  # Maximum borrow collateral factor
  minBorrowCollateralFactor: BigInt!  # Minimum borrow collateral factor
  
  # Liquidation collateral factors
  maxLiquidateCollateralFactor: BigInt! # Maximum liquidation collateral factor
  minLiquidateCollateralFactor: BigInt! # Minimum liquidation collateral factor
  
  # Liquidation factors
  maxLiquidationFactor: BigInt!       # Maximum liquidation penalty
  minLiquidationFactor: BigInt!       # Minimum liquidation penalty
  
  createdAt: BigInt!                  # Creation timestamp
}
```

**Key Properties:**

* `id`: The token address of the whitelisted collateral
* `priceFeed`: Oracle address for price data
* `maxBorrowCollateralFactor`/`minBorrowCollateralFactor`: Range of acceptable collateral factors for borrowing
* `maxLiquidateCollateralFactor`/`minLiquidateCollateralFactor`: Range of collateral factors that trigger liquidation
* `maxLiquidationFactor`/`minLiquidationFactor`: Range of liquidation penalties applied

### BaseAssetCurve

Defines the interest rate model for base assets, implementing a kinked interest rate curve.

```graphql
type BaseAssetCurve @entity(immutable: false) {
  id: String!                         # Curve identifier
  
  # Supply rate curve parameters
  supplyKink: BigInt!                 # Supply rate kink point (utilization %)
  supplyPerYearInterestRateBase: BigInt!      # Base supply rate
  supplyPerYearInterestRateSlopeLow: BigInt!  # Supply rate slope below kink
  supplyPerYearInterestRateSlopeHigh: BigInt! # Supply rate slope above kink
  
  # Borrow rate curve parameters
  borrowKink: BigInt!                 # Borrow rate kink point (utilization %)
  borrowPerYearInterestRateBase: BigInt!      # Base borrow rate
  borrowPerYearInterestRateSlopeLow: BigInt!  # Borrow rate slope below kink
  borrowPerYearInterestRateSlopeHigh: BigInt! # Borrow rate slope above kink
  
  # Metadata
  baseToken: Bytes!                   # Associated base token address
  curveIndex: Int!                    # Curve version index
  
  createdAt: BigInt!                  # Creation timestamp
  updatedAt: BigInt!                  # Last update timestamp
}
```

**Key Properties:**

* `id`: Unique identifier for the interest rate curve
* `supplyKink`/`borrowKink`: Utilization points where interest rate slope changes
* `supplyPerYearInterestRateBase`/`borrowPerYearInterestRateBase`: Base interest rates
* `supplyPerYearInterestRateSlopeLow`/`borrowPerYearInterestRateSlopeLow`: Rate increase per utilization point below kink
* `supplyPerYearInterestRateSlopeHigh`/`borrowPerYearInterestRateSlopeHigh`: Rate increase per utilization point above kink
* `curveIndex`: Version tracking for curve updates

### WhitelistedBase

Configuration for approved base assets that can be borrowed and supplied.

```graphql
type WhitelistedBase @entity(immutable: false) {
  id: Bytes!                          # Base token address
  priceFeed: Bytes!                   # Price feed contract address
  decimals: BigInt!                   # Token decimals
  
  curve: BaseAssetCurve!              # Associated interest rate curve
  
  minBorrow: BigInt!                  # Minimum borrow amount
  
  updatedAt: BigInt!                  # Last update timestamp
  createdAt: BigInt!                  # Creation timestamp
}
```

**Key Properties:**

* `id`: The token address of the whitelisted base asset
* `priceFeed`: Oracle address for price data
* `curve`: Reference to the interest rate model used for this asset
* `minBorrow`: Minimum amount that can be borrowed for this asset

## Accounting & Financial Data

### ProtocolAccounting

Aggregated financial data for the entire protocol.

```graphql
type ProtocolAccounting @entity(immutable: false) {
  id: Bytes!                          # Protocol ID
  protocol: Protocol!                 # Associated protocol
  lastUpdatedBlock: BigInt!           # Last update block
  
  # USD-denominated totals
  totalSupplyUsd: BigDecimal!         # Total supplied across all markets
  totalBorrowUsd: BigDecimal!         # Total borrowed across all markets
  reserveBalanceUsd: BigDecimal!      # Total base reserves
  collateralBalanceUsd: BigDecimal!   # Total collateral value
  collateralReservesBalanceUsd: BigDecimal! # Total collateral reserves
  totalReserveBalanceUsd: BigDecimal! # Total reserves (base + collateral)
  
  # Financial ratios
  utilization: BigDecimal!            # totalBorrowUsd / totalSupplyUsd
  collateralization: BigDecimal!      # totalSupplyUsd / totalBorrowUsd
  
  # Interest rates (protocol averages)
  avgSupplyApr: BigDecimal!           # Average supply APR
  avgBorrowApr: BigDecimal!           # Average borrow APR
  avgNetSupplyApr: BigDecimal!        # Average net supply APR (with rewards)
  avgNetBorrowApr: BigDecimal!        # Average net borrow APR (with rewards)
}
```

### MarketAccounting

Financial data for an individual market.

```graphql
type MarketAccounting @entity(immutable: false) {
  id: Bytes!                          # Market ID
  market: Market!                     # Associated market
  lastAccountingUpdatedBlockNumber: BigInt!
  
  # Interest tracking indices
  baseSupplyIndex: BigInt!            # Supply interest index
  baseBorrowIndex: BigInt!            # Borrow interest index
  trackingSupplyIndex: BigInt!        # Supply reward index
  trackingBorrowIndex: BigInt!        # Borrow reward index
  lastAccrualTime: BigInt!            # Last accrual timestamp
  
  # Principal amounts (for accurate calculations)
  totalBasePrincipalSupply: BigInt!   # Total supply principal
  totalBasePrincipalBorrow: BigInt!   # Total borrow principal
  
  # Current balances
  baseReserveBalance: BigInt!         # Base token reserves
  totalBaseSupply: BigInt!            # Total base supplied (present value)
  totalBaseBorrow: BigInt!            # Total base borrowed (present value)
  
  # Collateral balances
  collateralBalances: [MarketCollateralBalance!]!
  
  # USD-denominated amounts
  totalBaseSupplyUsd: BigDecimal!
  totalBaseBorrowUsd: BigDecimal!
  baseReserveBalanceUsd: BigDecimal!
  collateralBalanceUsd: BigDecimal!
  collateralReservesBalanceUsd: BigDecimal!
  totalReserveBalanceUsd: BigDecimal!
  
  # Financial ratios
  utilization: BigDecimal!            # Utilization ratio
  collateralization: BigDecimal!      # Collateralization ratio
  
  # Interest rates
  supplyApr: BigDecimal!              # Current supply APR
  borrowApr: BigDecimal!              # Current borrow APR
  netSupplyApr: BigDecimal!           # Net supply APR (with rewards)
  netBorrowApr: BigDecimal!           # Net borrow APR (with rewards)
}
```

### PositionAccounting

Financial data for a user's position.

```graphql
type PositionAccounting @entity(immutable: false) {
  id: Bytes!                          # Position ID
  lastUpdatedBlockNumber: BigInt!
  position: Position!                 # Associated position
  
  # Base token balance
  basePrincipal: BigInt!              # Base principal (+ supply, - borrow)
  baseBalance: BigInt!                # Current base balance
  baseTrackingIndex: BigInt!          # Reward tracking index
  baseTrackingAccrued: BigInt!        # Accrued rewards
  
  # USD-denominated balances
  baseBalanceUsd: BigDecimal!         # Base balance in USD
  collateralBalanceUsd: BigDecimal!   # Collateral balance in USD
  
  # Collateral balances
  collateralBalances: [PositionCollateralBalance!]!
  
  # Cumulative statistics
  cumulativeBaseSupplied: BigInt!     # Total base supplied
  cumulativeBaseWithdrawn: BigInt!    # Total base withdrawn
  cumulativeBaseDebtAbsorbed: BigInt! # Debt absorbed via liquidation
  
  # Cumulative USD statistics
  cumulativeBaseSuppliedUsd: BigDecimal!
  cumulativeBaseWithdrawnUsd: BigDecimal!
  cumulativeCollateralLiquidatedUsd: BigDecimal!
  
  # Rewards
  cumulativeRewardsClaimed: BigInt!
  cumulativeRewardsClaimedUsd: BigDecimal!
  
  # Gas tracking
  cumulativeGasUsedWei: BigInt!
  cumulativeGasUsedUsd: BigDecimal!
}
```

## Usage Analytics

### Usage

Tracks protocol usage statistics.

```graphql
type Usage @entity(immutable: false) {
  id: Bytes!                          # Usage identifier
  protocol: Protocol!                 # Associated protocol
  
  # User statistics
  uniqueUsersCount: BigInt!           # Number of unique users
  interactionCount: BigInt!           # Total interactions
  
  # Interaction breakdown
  supplyBaseCount: BigInt!            # Base supply interactions
  withdrawBaseCount: BigInt!          # Base withdraw interactions
  transferBaseCount: BigInt!          # Base transfer interactions
  liquidationCount: BigInt!           # Liquidation interactions
  supplyCollateralCount: BigInt!      # Collateral supply interactions
  withdrawCollateralCount: BigInt!    # Collateral withdraw interactions
  transferCollateralCount: BigInt!    # Collateral transfer interactions
}
```

## Historical Snapshots

The subgraph maintains comprehensive historical data through periodic snapshots.

### Protocol-Level Snapshots

```graphql
type HourlyProtocolAccounting @entity(immutable: false) {
  id: Bytes!                          # Hour identifier
  hour: BigInt!                       # Hours since unix epoch
  timestamp: BigInt!                  # Timestamp in seconds
  protocol: Protocol!                 # Associated protocol
  accounting: ProtocolAccounting!     # Accounting snapshot
}

type DailyProtocolAccounting @entity(immutable: false) {
  id: Bytes!                          # Day identifier
  day: BigInt!                        # Days since unix epoch
  timestamp: BigInt!                  # Timestamp in seconds
  protocol: Protocol!                 # Associated protocol
  accounting: ProtocolAccounting!     # Accounting snapshot
}

type WeeklyProtocolAccounting @entity(immutable: false) {
  id: Bytes!                          # Week identifier
  week: BigInt!                       # Weeks since unix epoch
  timestamp: BigInt!                  # Timestamp in seconds
  protocol: Protocol!                 # Associated protocol
  accounting: ProtocolAccounting!     # Accounting snapshot
}
```

### Market-Level Snapshots

```graphql
type HourlyMarketAccounting @entity(immutable: false) {
  id: Bytes!                          # Market ID + hour
  hour: BigInt!                       # Hours since unix epoch
  timestamp: BigInt!                  # Timestamp in seconds
  market: Market!                     # Associated market
  accounting: MarketAccounting!       # Accounting snapshot
}

type DailyMarketAccounting @entity(immutable: false) {
  id: Bytes!                          # Market ID + day
  day: BigInt!                        # Days since unix epoch
  timestamp: BigInt!                  # Timestamp in seconds
  market: Market!                     # Associated market
  accounting: MarketAccounting!       # Accounting snapshot
}

type WeeklyMarketAccounting @entity(immutable: false) {
  id: Bytes!                          # Market ID + week
  week: BigInt!                       # Weeks since unix epoch
  timestamp: BigInt!                  # Timestamp in seconds
  market: Market!                     # Associated market
  accounting: MarketAccounting!       # Accounting snapshot
}
```

### Position-Level Snapshots

```graphql
type PositionAccountingSnapshot @entity(immutable: false) {
  id: Bytes!                          # Position ID + block + log index
  timestamp: BigInt!                  # Timestamp in seconds
  position: Position!                 # Associated position
  accounting: PositionAccounting!     # Accounting snapshot
}
```

**Note**: Position snapshots are event-driven (taken when position changes) rather than periodic.

## Token Management

### Token

Base token information with price tracking.

```graphql
type Token @entity(immutable: false) {
  id: Bytes!                          # Token address
  address: Bytes!                     # Token contract address
  name: String!                       # Token name
  symbol: String!                     # Token symbol
  decimals: Int                       # Token decimals
  
  # Price information
  lastPriceUsd: BigDecimal!           # Last price in USD
  lastPriceBlockNumber: BigInt!       # Block of last price update
}
```

### BaseToken

Configuration for base tokens (the primary asset in each market).

```graphql
type BaseToken @entity(immutable: false) {
  id: Bytes!                          # Market ID + token ID
  creationBlockNumber: BigInt!        # Creation block
  market: Market!                     # Associated market
  token: Token!                       # Token reference
  
  # Configuration
  lastConfigUpdateBlockNumber: BigInt!
  priceFeed: Bytes!                   # Price feed address
  
  # Price tracking
  lastPriceUsd: BigDecimal!           # Last price in USD
  lastPriceBlockNumber: BigInt!       # Last price update block
}
```

### CollateralToken

Configuration for collateral tokens.

```graphql
type CollateralToken @entity(immutable: false) {
  id: Bytes!                          # Market ID + token ID + 'Col'
  creationBlockNumber: BigInt!        # Creation block
  market: Market!                     # Associated market
  token: Token!                       # Token reference
  
  # Configuration
  lastConfigUpdateBlockNumber: BigInt!
  priceFeed: Bytes!                   # Price feed address
  
  # Collateral factors
  borrowCollateralFactor: BigDecimal!     # Borrow factor
  liquidateCollateralFactor: BigDecimal!  # Liquidation factor
  liquidationFactor: BigDecimal!          # Liquidation penalty
  supplyCap: BigInt!                      # Supply cap
  
  # Price tracking
  lastPriceUsd: BigDecimal!           # Last price in USD
  lastPriceBlockNumber: BigInt!       # Last price update block
}
```

## Interactions & Transactions

### Transaction

Represents a blockchain transaction containing protocol interactions.

```graphql
type Transaction @entity(immutable: true) {
  id: Bytes!                          # Transaction hash
  hash: Bytes!                        # Transaction hash
  blockNumber: BigInt!                # Block number
  timestamp: BigInt!                  # Transaction timestamp
  
  # Transaction details
  from: Bytes!                        # From address
  to: Bytes                          # To address
  gasLimit: BigInt!                   # Gas limit
  gasPrice: BigInt!                   # Gas price
  gasUsed: BigInt                     # Gas used
  gasUsedUsd: BigDecimal             # Gas cost in USD
  
  # Interaction counts (for filtering)
  supplyBaseInteractionCount: Int!
  withdrawBaseInteractionCount: Int!
  transferBaseInteractionCount: Int!
  absorbDebtInteractionCount: Int!
  supplyCollateralInteractionCount: Int!
  withdrawCollateralInteractionCount: Int!
  transferCollateralInteractionCount: Int!
  absorbCollateralInteractionCount: Int!
  buyCollateralInteractionCount: Int!
  withdrawReservesInteractionCount: Int!
  claimRewardsInteractionCount: Int!
  
  # Derived fields (all interactions in this transaction)
  supplyBaseInteractions: [SupplyBaseInteraction!]!
  withdrawBaseInteractions: [WithdrawBaseInteraction!]!
  transferBaseInteractions: [TransferBaseInteraction!]!
  absorbDebtInteractions: [AbsorbDebtInteraction!]!
  supplyCollateralInteractions: [SupplyCollateralInteraction!]!
  withdrawCollateralInteractions: [WithdrawCollateralInteraction!]!
  transferCollateralInteractions: [TransferCollateralInteraction!]!
  absorbCollateralInteractions: [AbsorbCollateralInteraction!]!
  buyCollateralInteractions: [BuyCollateralInteraction!]!
  withdrawReservesInteractions: [WithdrawReservesInteraction!]!
  claimRewardsInteractions: [ClaimRewardsInteraction!]!
}
```

### Base Asset Interactions

**SupplyBaseInteraction**

```graphql
type SupplyBaseInteraction @entity(immutable: true) {
  id: Bytes!                          # Transaction ID + log index
  transaction: Transaction!           # Associated transaction
  market: Market!                     # Target market
  position: Position!                 # Target position
  supplier: Bytes!                    # Address supplying funds
  
  asset: BaseToken!                   # Asset being supplied
  amount: BigInt!                     # Amount supplied
  amountUsd: BigDecimal!              # Amount in USD
}
```

**WithdrawBaseInteraction**

```graphql
type WithdrawBaseInteraction @entity(immutable: true) {
  id: Bytes!                          # Transaction ID + log index
  transaction: Transaction!           # Associated transaction
  market: Market!                     # Source market
  position: Position!                 # Source position
  destination: Bytes!                 # Destination address
  
  asset: BaseToken!                   # Asset being withdrawn
  amount: BigInt!                     # Amount withdrawn
  amountUsd: BigDecimal!              # Amount in USD
}
```

**TransferBaseInteraction**

```graphql
type TransferBaseInteraction @entity(immutable: true) {
  id: Bytes!                          # Transaction ID + log index
  transaction: Transaction!           # Associated transaction
  market: Market!                     # Market for transfer
  fromPosition: Position              # From position (null for mint)
  toPosition: Position                # To position (null for burn)
  
  asset: BaseToken!                   # Asset being transferred
  amount: BigInt!                     # Amount transferred
  amountUsd: BigDecimal!              # Amount in USD
}
```

**AbsorbDebtInteraction**

```graphql
type AbsorbDebtInteraction @entity(immutable: true) {
  id: Bytes!                          # Transaction ID + log index
  transaction: Transaction!           # Associated transaction
  market: Market!                     # Market where debt is absorbed
  position: Position!                 # Position being liquidated
  absorber: Bytes!                    # Address triggering absorption
  
  asset: BaseToken!                   # Asset being absorbed
  amount: BigInt!                     # Amount of debt absorbed
  amountUsd: BigDecimal!              # Amount in USD
}
```

### Collateral Interactions

**SupplyCollateralInteraction**

```graphql
type SupplyCollateralInteraction @entity(immutable: true) {
  id: Bytes!                          # Transaction ID + log index
  transaction: Transaction!           # Associated transaction
  market: Market!                     # Target market
  position: Position!                 # Target position
  supplier: Bytes!                    # Address supplying collateral
  
  asset: CollateralToken!             # Collateral being supplied
  amount: BigInt!                     # Amount supplied
  amountUsd: BigDecimal!              # Amount in USD
}
```

**WithdrawCollateralInteraction**

```graphql
type WithdrawCollateralInteraction @entity(immutable: true) {
  id: Bytes!                          # Transaction ID + log index
  transaction: Transaction!           # Associated transaction
  market: Market!                     # Source market
  position: Position!                 # Source position
  destination: Bytes!                 # Destination address
  
  asset: CollateralToken!             # Collateral being withdrawn
  amount: BigInt!                     # Amount withdrawn
  amountUsd: BigDecimal!              # Amount in USD
}
```

**TransferCollateralInteraction**

```graphql
type TransferCollateralInteraction @entity(immutable: true) {
  id: Bytes!                          # Transaction ID + log index
  transaction: Transaction!           # Associated transaction
  market: Market!                     # Market for transfer
  fromPosition: Position!             # From position
  toPosition: Position!               # To position
  
  asset: CollateralToken!             # Collateral being transferred
  amount: BigInt!                     # Amount transferred
  amountUsd: BigDecimal!              # Amount in USD
}
```

### Liquidation Interactions

**AbsorbCollateralInteraction**

```graphql
type AbsorbCollateralInteraction @entity(immutable: true) {
  id: Bytes!                          # Transaction ID + log index
  transaction: Transaction!           # Associated transaction
  market: Market!                     # Market where collateral is absorbed
  position: Position!                 # Position being liquidated
  absorber: Bytes!                    # Address triggering absorption
  
  asset: CollateralToken!             # Collateral being absorbed
  amount: BigInt!                     # Amount absorbed
  amountUsd: BigDecimal!              # Amount in USD
}
```

**BuyCollateralInteraction**

```graphql
type BuyCollateralInteraction @entity(immutable: true) {
  id: Bytes!                          # Transaction ID + log index
  transaction: Transaction!           # Associated transaction
  market: Market!                     # Market for purchase
  buyer: Bytes!                       # Address buying collateral
  
  asset: CollateralToken!             # Collateral being bought
  collateralAmount: BigInt!           # Amount of collateral bought
  baseAmount: BigInt!                 # Amount of base asset paid
  collateralAmountUsd: BigDecimal!    # Collateral value in USD
  baseAmountUsd: BigDecimal!          # Base asset value in USD
}
```

### Other Interactions

**WithdrawReservesInteraction**

```graphql
type WithdrawReservesInteraction @entity(immutable: true) {
  id: Bytes!                          # Transaction ID + log index
  transaction: Transaction!           # Associated transaction
  market: Market!                     # Source market
  destination: Bytes!                 # Destination address
  
  amount: BigInt!                     # Amount of reserves withdrawn
  amountUsd: BigDecimal!              # Amount in USD
}
```

**ClaimRewardsInteraction**

```graphql
type ClaimRewardsInteraction @entity(immutable: true) {
  id: Bytes!                          # Transaction ID + log index
  transaction: Transaction!           # Associated transaction
  account: Account!                   # Account claiming rewards
  position: Position                  # Position (optional, inferred)
  destination: Bytes!                 # Destination address
  
  token: Token!                       # Reward token
  amount: BigInt!                     # Amount claimed
  amountUsd: BigDecimal!              # Amount in USD
}
```

## Query Examples

### Basic Market Information

```graphql
query GetMarkets {
  markets {
    id
    configuration {
      name
      symbol
      supplyKink
      borrowKink
    }
    accounting {
      totalBaseSupplyUsd
      totalBaseBorrowUsd
      utilization
      supplyApr
      borrowApr
    }
  }
}
```

### User Position Details

```graphql
query GetUserPositions($userAddress: Bytes!) {
  positions(where: { account: $userAddress }) {
    id
    market {
      configuration {
        name
        symbol
      }
    }
    accounting {
      baseBalanceUsd
      collateralBalanceUsd
      collateralBalances {
        collateralToken {
          token {
            symbol
          }
        }
        balanceUsd
      }
    }
  }
}
```

### Historical Market Data

```graphql
query GetMarketHistory($marketId: Bytes!, $startTime: BigInt!) {
  dailyMarketAccountings(
    where: { 
      market: $marketId
      timestamp_gte: $startTime
    }
    orderBy: timestamp
    orderDirection: asc
  ) {
    timestamp
    accounting {
      totalBaseSupplyUsd
      totalBaseBorrowUsd
      utilization
      supplyApr
      borrowApr
    }
  }
}
```

## Important Note on Collateral Balance Updates

> **Note:** Any invocation of `updateMarketCollateralBalance` must always be accompanied by a call to `updateMarketCollateralBalanceUsd`, and vice versa. This ensures both the raw and USD-denominated collateral balances remain consistent. Failure to do so may result in data desynchronization within the subgraph index.