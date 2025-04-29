import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { WhitelistedCollateral } from '../../generated/schema';

export function createWhitelistedCollateral(
  address: Address,
  //
  priceFeed: Address,
  decimals: BigInt,
  maxBorrowCollateralFactor: BigInt,
  minBorrowCollateralFactor: BigInt,
  maxLiquidateCollateralFactor: BigInt,
  minLiquidateCollateralFactor: BigInt,
  maxLiquidationFactor: BigInt,
  minLiquidationFactor: BigInt,
  //
  createdAt: BigInt
): WhitelistedCollateral {
  const id = Bytes.fromHexString(address.toHexString());

  let collateral = WhitelistedCollateral.load(id);
  if (!collateral) {
    collateral = new WhitelistedCollateral(id);
    //
    collateral.priceFeed = priceFeed;
    collateral.decimals = decimals;
    collateral.maxBorrowCollateralFactor = maxBorrowCollateralFactor;
    collateral.minBorrowCollateralFactor = minBorrowCollateralFactor;
    collateral.maxLiquidateCollateralFactor = maxLiquidateCollateralFactor;
    collateral.minLiquidateCollateralFactor = minLiquidateCollateralFactor;
    collateral.maxLiquidationFactor = maxLiquidationFactor;
    collateral.minLiquidationFactor = minLiquidationFactor;
    //
    collateral.createdAt = createdAt;

    collateral.save();
  }

  return collateral;
}
