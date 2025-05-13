import { BigInt } from '@graphprotocol/graph-ts';
import {
  BaseAssetCurveAdded as BaseAssetCurveAddedEvent,
  BaseAssetCurveChanged as BaseAssetCurveChangedEvent,
  CollateralAssetWhitelisted as CollateralAssetWhitelistedEvent,
} from '../generated/SandboxController/SandboxController';
import { BaseAssetWhitelisted as BaseAssetWhitelistedEvent } from '../generated/SandboxController/SandboxController';
import { logEvent } from './utils/log-event';
import { createCurve } from './helpers/create-curve';
import { createWhitelistedBase } from './helpers/create-whitelisted-base';
import { createWhitelistedCollateral } from './helpers/create-whitelisted-collateral';
import { updateBaseCurve } from './helpers/update-base-curve';

// TODO
export function handleBaseAssetCurveAdded(
  event: BaseAssetCurveAddedEvent
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
  updateBaseCurve(event.params.token, curve.id, event.block.timestamp);
}

// TODO
export function handleBaseAssetCurveChanged(
  event: BaseAssetCurveChangedEvent
): void {
  logEvent(event);
  const newCurve = createCurve(
    // TODO: change curve by id
    event.block.number.toString(), // TODO: use real curve id
    //
    event.params.newCurve.supplyKink,
    event.params.newCurve.supplyPerYearInterestRateBase,
    event.params.newCurve.supplyPerYearInterestRateSlopeLow,
    event.params.newCurve.supplyPerYearInterestRateSlopeHigh,
    event.params.newCurve.borrowKink,
    event.params.newCurve.borrowPerYearInterestRateBase,
    event.params.newCurve.borrowPerYearInterestRateSlopeLow,
    event.params.newCurve.borrowPerYearInterestRateSlopeHigh,
    //
    event.block.timestamp
  );
  updateBaseCurve(event.params.token, newCurve.id, event.block.timestamp);
}

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
