import { BigInt, log } from '@graphprotocol/graph-ts';
import {
  BaseAssetCurveAdded as BaseAssetCurveAddedEvent,
  BaseAssetCurveChanged as BaseAssetCurveChangedEvent,
  CollateralAssetWhitelisted as CollateralAssetWhitelistedEvent,
} from '../generated/SandboxController/SandboxController';
import { BaseAssetWhitelisted as BaseAssetWhitelistedEvent } from '../generated/SandboxController/SandboxController';
import { logEvent } from './common/utils/log-event';
import { createCurve } from './helpers/create-curve';
import { createWhitelistedBase } from './helpers/create-whitelisted-base';
import { createWhitelistedCollateral } from './helpers/create-whitelisted-collateral';
import { updateCurve } from './helpers/update-curve';

export function handleBaseAssetCurveAdded(
  event: BaseAssetCurveAddedEvent
): void {
  logEvent(event);
  createCurve(
    event.params.token,
    event.params.curveIndex,
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
}

export function handleBaseAssetCurveChanged(
  event: BaseAssetCurveChangedEvent
): void {
  logEvent(event);
  const existing = updateCurve(
    event.params.token,
    event.params.curveIndex,
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
  if (!existing) {
    log.warning(
      `Curve for update does not exists => address: {}, curveIndex: {}`,
      [event.params.token.toHexString(), event.params.curveIndex.toString()]
    );
  }
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
    //
    event.block.timestamp
  );
}

export function handleBaseAssetWhitelisted(
  event: BaseAssetWhitelistedEvent
): void {
  logEvent(event);
  const decimals = BigInt.fromI32(event.params.decimals);
  createWhitelistedBase(
    event.params.token,
    //
    event.params.priceFeed,
    decimals,
    //
    event.block.timestamp
  );
}
