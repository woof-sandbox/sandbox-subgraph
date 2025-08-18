import {
  Address,
  BigDecimal,
  BigInt,
  Bytes,
  ethereum,
  log,
} from '@graphprotocol/graph-ts';
import { ChainlinkPriceFeed } from '../../generated/templates/Comet/ChainlinkPriceFeed';
import { PriceFeed } from '../../generated/schema';

function exponentToBigDecimal(decimals: i32): BigDecimal {
  // 10^decimals as BigDecimal
  return BigInt.fromI32(10).pow(<u8>decimals).toBigDecimal();
}

function toPriceUsd(price: BigInt, decimals: i32): BigDecimal {
  return price.toBigDecimal().div(exponentToBigDecimal(decimals));
}

export function getAndUpdatePriceFeed(
  address: Bytes,
  event: ethereum.Event
): PriceFeed {
  let priceFeed = PriceFeed.load(address);
  const contract = ChainlinkPriceFeed.bind(Address.fromBytes(address));
  if (!priceFeed) {
    // Is not exists - create strictly
    // Decimals (priceScale) can be different
    priceFeed = new PriceFeed(address);
    priceFeed.priceScaleDecimals = contract.decimals(); // crucial, so without try. priceScale
    priceFeed.lastPriceUsd = toPriceUsd(
      contract.latestRoundData().value1,
      priceFeed.priceScaleDecimals
    );

    priceFeed.createdAt = event.block.timestamp;
    priceFeed.updatedAt = event.block.timestamp;
  } else {
    if (priceFeed.updatedAt === event.block.timestamp) {
      // Don't bother if already updated
      return priceFeed;
    }
    // If already exists only try to update last price
    // Decimals is not going to change, because of wrapper across fallback price feed, that handle it
    const tryLatestRoundData = contract.try_latestRoundData();
    if (!tryLatestRoundData.reverted) {
      priceFeed.lastPriceUsd = toPriceUsd(
        tryLatestRoundData.value.value1,
        priceFeed.priceScaleDecimals
      );
      priceFeed.updatedAt = event.block.timestamp;
    } else {
      log.warning(
        'getOrCreatePriceFeed - try_latestRoundData reverted for {}',
        [address.toString()]
      );
    }
  }

  priceFeed.save();

  return priceFeed;
}
