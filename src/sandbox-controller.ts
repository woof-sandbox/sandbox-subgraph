import { BigInt } from '@graphprotocol/graph-ts';
import { CollateralAssetWhitelisted as CollateralAssetWhitelistedEvent } from '../generated/SandboxController/SandboxController';
import { BaseAssetWhitelisted as BaseAssetWhitelistedEvent } from '../generated/SandboxController/SandboxController';
import { logEvent } from './utils/log-event';
import { createCurve } from './helpers/create-curve';
import { createWhitelistedBase } from './helpers/create-whitelisted-base';
import { createWhitelistedCollateral } from './helpers/create-whitelisted-collateral';

export function handleCollateralAssetWhitelisted(
  event: CollateralAssetWhitelistedEvent
): void {
  logEvent(event);
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
    event.block.timestamp
  );
}

export function handleBaseAssetWhitelisted(
  event: BaseAssetWhitelistedEvent
): void {
  logEvent(event);
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
    event.block.timestamp
  );

  const decimals = BigInt.fromI32(event.params.decimals); // !

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
    event.block.timestamp
  );
}
