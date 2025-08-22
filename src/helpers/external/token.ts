import {
  Address,
  BigDecimal,
  Bytes,
  ethereum,
  log,
} from '@graphprotocol/graph-ts';
import { Comet as CometContract } from '../../../generated/templates/Comet/Comet';
import { Erc20 as Erc20Contract } from '../../../generated/templates/Comet/Erc20';
import {
  BaseToken,
  CollateralToken,
  Market,
  Token,
} from '../../../generated/schema';
import { formatUnits } from '../../common/external/utils';
import { UNKNOWN } from '../../common/constants';
import {
  ZERO_ADDRESS,
  ZERO_BD,
  ZERO_BI,
} from '../../common/external/constants';
import {
  getChainlinkCompUsdPriceFeedAddress,
  getCompTokenAddress,
  getMarketUnitOfAccountToUsdPriceFeed,
} from '../../common/external/networkSpecific';
import { getAndUpdatePriceFeed } from '../get-and-update-price-feed';

////
// Token
////

export function getOrCreateToken(
  address: Address,
  event: ethereum.Event
): Token {
  let token = Token.load(address);

  if (!token) {
    token = new Token(address);

    const erc20 = Erc20Contract.bind(address);

    const tryName = erc20.try_name();
    const trySymbol = erc20.try_symbol();

    token.address = address;
    token.name = tryName.reverted ? UNKNOWN : tryName.value;
    token.symbol = trySymbol.reverted ? UNKNOWN : trySymbol.value;
    token.decimals = erc20.decimals();

    token.lastPriceBlockNumber = ZERO_BI;
    token.lastPriceUsd = ZERO_BD;

    token.save();
  }

  return token;
}

////
// Base Token
////

export function getOrCreateBaseToken(
  market: Market,
  token: Token,
  event: ethereum.Event
): BaseToken {
  const id = market.id.concat(token.id);
  let baseToken = BaseToken.load(id);

  if (!baseToken) {
    baseToken = new BaseToken(id);

    baseToken.creationBlockNumber = event.block.number;
    baseToken.market = market.id;
    baseToken.token = token.id;

    //// replaced zeros with the price
    baseToken.lastPriceBlockNumber = token.lastPriceBlockNumber;
    baseToken.lastPriceUsd = token.lastPriceUsd;

    updateBaseTokenConfig(baseToken, event);

    baseToken.save();
    //// replaced zeros with the price
    if (baseToken.lastPriceUsd === ZERO_BD) {
      getAndUpdateBaseTokenPriceUsd(baseToken, event);
    }
  }

  return baseToken;
}

export function updateBaseTokenConfig(
  baseToken: BaseToken,
  event: ethereum.Event
): void {
  const comet = CometContract.bind(Address.fromBytes(baseToken.market));

  baseToken.lastConfigUpdateBlockNumber = event.block.number;
  baseToken.priceFeed = comet.baseTokenPriceFeed();
}

////
// Collateral Asset
////

export function getOrCreateCollateralToken(
  market: Market,
  token: Token,
  event: ethereum.Event
): CollateralToken {
  const id = market.id.concat(token.id).concat(Bytes.fromUTF8('COL'));
  let collateralToken = CollateralToken.load(id);

  if (!collateralToken) {
    collateralToken = new CollateralToken(id);

    collateralToken.creationBlockNumber = event.block.number;
    collateralToken.market = market.id;
    collateralToken.token = token.id;

    collateralToken.lastPriceBlockNumber = ZERO_BI;
    collateralToken.lastPriceUsd = ZERO_BD;

    updateCollateralTokenConfig(collateralToken, event);

    collateralToken.save();
  }

  return collateralToken;
}

export function updateCollateralTokenConfig(
  collateralToken: CollateralToken,
  event: ethereum.Event
): void {
  const comet = CometContract.bind(Address.fromBytes(collateralToken.market));
  const assetInfo = comet.getAssetInfoByAddress(
    Address.fromBytes(collateralToken.token)
  );

  collateralToken.lastConfigUpdateBlockNumber = event.block.number;
  collateralToken.priceFeed = assetInfo.value0.priceFeed; // added value0
  collateralToken.borrowCollateralFactor = formatUnits(
    assetInfo.value0.borrowCollateralFactor,
    18
  );
  collateralToken.liquidateCollateralFactor = formatUnits(
    assetInfo.value0.liquidateCollateralFactor,
    18
  );
  collateralToken.liquidationFactor = formatUnits(
    assetInfo.value0.liquidationFactor,
    18
  );
  collateralToken.supplyCap = assetInfo.value0.supplyCap;
}

export function createCollateralTokenSnapshot(
  collateralToken: CollateralToken,
  event: ethereum.Event
): CollateralToken {
  const snapshotId = collateralToken.id
    .concat(Bytes.fromByteArray(Bytes.fromBigInt(event.block.number)))
    .concat(Bytes.fromByteArray(Bytes.fromBigInt(event.logIndex)));

  const snapshot = new CollateralToken(snapshotId);

  let entries = collateralToken.entries;
  for (let i = 0; i < entries.length; ++i) {
    if (entries[i].key.toString() != 'id') {
      snapshot.set(entries[i].key, entries[i].value);
    }
  }

  snapshot.save();

  return snapshot;
}

////
// Price
////

function getPriceFeedAddressForToken(token: Token): Address {
  // Other feeds can be added here also
  if (token.address.equals(getCompTokenAddress())) {
    return getChainlinkCompUsdPriceFeedAddress();
  } else {
    log.warning('getPriceFeedAddressForToken - no price feed for {}', [
      token.address.toString(),
    ]);
    return ZERO_ADDRESS;
  }
}

function getAndUpdateTokenPriceWithGenericOracleUsd(
  token: Token,
  event: ethereum.Event
): BigDecimal {
  if (token.lastPriceBlockNumber != event.block.number) {
    const priceFeedAddress = getPriceFeedAddressForToken(token);

    if (ZERO_ADDRESS != priceFeedAddress) {
      const priceFeed = getAndUpdatePriceFeed(priceFeedAddress, event);
      if (priceFeed.updatedAt === event.block.timestamp) {
        // If price was updated
        token.lastPriceBlockNumber = event.block.number;
        token.lastPriceUsd = priceFeed.lastPriceUsd;
        token.save();
      }
    }
  }

  return token.lastPriceUsd;
}

function getAndUpdateBaseTokenPriceUsd(
  token: BaseToken,
  event: ethereum.Event
): BigDecimal {
  if (token.lastPriceBlockNumber != event.block.number) {
    const priceFeed = getAndUpdatePriceFeed(token.priceFeed, event); /// replaced comet.try_getPrice(Address.fromBytes(token.priceFeed))

    if (priceFeed.updatedAt === event.block.timestamp) {
      // If price was updated
      let price = priceFeed.lastPriceUsd; // In unit of account

      const unitOfAccountToUsdPriceFeed = getMarketUnitOfAccountToUsdPriceFeed(
        Address.fromBytes(token.market)
      );

      if (unitOfAccountToUsdPriceFeed.notEqual(ZERO_ADDRESS)) {
        const unitOfAccountPriceUsd = getAndUpdatePriceFeed(
          unitOfAccountToUsdPriceFeed,
          event
        ).lastPriceUsd;
        price = price.times(unitOfAccountPriceUsd);
      }

      token.lastPriceBlockNumber = event.block.number;
      token.lastPriceUsd = price;
      token.save();
    }
  }

  return token.lastPriceUsd;
}

function getAndUpdateCollateralTokenPriceUsd(
  token: CollateralToken,
  event: ethereum.Event
): BigDecimal {
  let price = token.lastPriceUsd;

  if (token.lastPriceBlockNumber != event.block.number) {
    const priceFeed = getAndUpdatePriceFeed(token.priceFeed, event); /// replaced comet.try_getPrice(Address.fromBytes(token.priceFeed))

    if (priceFeed.updatedAt === event.block.timestamp) {
      // if price was updated
      let price = priceFeed.lastPriceUsd;

      const unitOfAccountToUsdPriceFeed = getMarketUnitOfAccountToUsdPriceFeed(
        Address.fromBytes(token.market)
      );
      if (unitOfAccountToUsdPriceFeed.notEqual(ZERO_ADDRESS)) {
        const unitOfAccountPriceUsd = getAndUpdatePriceFeed(
          unitOfAccountToUsdPriceFeed,
          event
        ).lastPriceUsd;

        price = price.times(unitOfAccountPriceUsd);
      }

      token.lastPriceBlockNumber = event.block.number;
      token.lastPriceUsd = price;
      token.save();
    }
  }

  return price;
}

export function getAndUpdateTokenPriceUsd<T>(
  token: T,
  event: ethereum.Event
): BigDecimal {
  if (token instanceof Token) {
    /// Rewards only, not in use
    return getAndUpdateTokenPriceWithGenericOracleUsd(token, event);
  } else if (token instanceof BaseToken) {
    return getAndUpdateBaseTokenPriceUsd(token, event);
  } else if (token instanceof CollateralToken) {
    return getAndUpdateCollateralTokenPriceUsd(token, event);
  } else {
    log.warning('Invalid token type in getTokenPriceUsd: {}', [typeof token]);
    return ZERO_BD;
  }
}
