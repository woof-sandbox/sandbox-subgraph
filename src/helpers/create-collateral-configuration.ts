import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { CollateralConfiguration } from '../../generated/schema';

export function createCollateralConfiguration(
  assetAddress: Address,
  //
  priceFeed: Address,
  decimals: BigInt,
  borrowCollateralFactor: BigInt,
  liquidateCollateralFactor: BigInt,
  liquidationFactor: BigInt,
  supplyCap: BigInt,
  //
  createdAt: BigInt
): CollateralConfiguration {
  const id = Bytes.fromHexString(assetAddress.toHexString()); // TODO: replace with the real id

  let configuration = CollateralConfiguration.load(id);
  if (!configuration) {
    configuration = new CollateralConfiguration(id);
    //
    configuration.priceFeed = priceFeed;
    configuration.decimals = decimals;
    configuration.borrowCollateralFactor = borrowCollateralFactor;
    configuration.liquidateCollateralFactor = liquidateCollateralFactor;
    configuration.liquidationFactor = liquidationFactor;
    configuration.supplyCap = supplyCap;
    //
    configuration.createdAt = createdAt;
    configuration.updatedAt = createdAt;
    configuration.save();
  }

  return configuration;
}
