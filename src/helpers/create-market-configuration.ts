import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { MarketConfiguration } from '../../generated/schema';

export function createMarketConfiguration(
  marketAddress: Address,
  //
  baseToken: Address,
  baseTokenId: BigInt,
  priceFeed: Address,
  //
  createdAt: BigInt
): MarketConfiguration {
  const id = Bytes.fromHexString(marketAddress.toHexString()); // TODO: replace with the real id

  let configuration = MarketConfiguration.load(id);
  if (!configuration) {
    configuration = new MarketConfiguration(id);
    configuration.market = marketAddress;
    configuration.baseToken = baseToken;
    configuration.baseTokenId = baseTokenId;
    configuration.priceFeed = priceFeed;
    //
    configuration.createdAt = createdAt;
    configuration.updatedAt = createdAt;
    configuration.save();
  }

  return configuration;
}
