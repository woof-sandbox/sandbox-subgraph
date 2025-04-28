import { CollateralAssetWhitelisted as CollateralAssetWhitelistedEvent } from '../generated/SandboxController/SandboxController';
import { BaseAssetWhitelisted as BaseAssetWhitelistedEvent } from '../generated/SandboxController/SandboxController';
import { createWhitelistedCollateral } from './helpers/create-whitelisted-collateral';
import { createWhitelistedBase } from './helpers/create-whitelisted-base';
import { createCurve } from './helpers/create-curve';
import { BigInt, log } from '@graphprotocol/graph-ts';

export function handleCollateralAssetWhitelisted(
  event: CollateralAssetWhitelistedEvent,
): void {
  createWhitelistedCollateral(
    event.params.token,
    //
    event.params.priceFeed,
    event.params.decimals,
    event.params.maxBorrowCollateralFactor,
    event.params.minBorrowCollateralFactor,
    event.params.maxLiquidateCollateralFactor,
    event.params.minLiquidateCollateralFactor,
    event.params.maxLiquidationFactor,
    event.params.minLiquidationFactor,
    //
    event.block.timestamp,
  );
}

export function handleBaseAssetWhitelisted(
  event: BaseAssetWhitelistedEvent,
): void {
  const curve = createCurve(
    event.block.number.toString(), // TODO: use real curve id
    //
    event.params.baseAssetCurve.supplyKink,
    event.params.baseAssetCurve.supplyPerYearInterestRateBase,
    event.params.baseAssetCurve.supplyPerYearInterestRateSlopeLow,
    event.params.baseAssetCurve.supplyPerYearInterestRateSlopeHigh,
    event.params.baseAssetCurve.borrowKink,
    event.params.baseAssetCurve.borrowPerYearInterestRateBase,
    event.params.baseAssetCurve.borrowPerYearInterestRateSlopeLow,
    event.params.baseAssetCurve.borrowPerYearInterestRateSlopeHigh,
    //
    event.block.timestamp,
  )

  log.debug('before', []);
  const decimals = BigInt.fromI32(event.params.decimals); // !:
  log.debug('after', []);


  createWhitelistedBase(
    event.params.token,
    //
    event.params.priceFeed,
    decimals,
    //
    curve.id,
    //
    event.params.minBorrow,
    //
    event.block.timestamp,
  )
}
