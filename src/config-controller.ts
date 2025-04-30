import { BigInt } from '@graphprotocol/graph-ts';
import {
  AddedBaseTokenConfig as AddedBaseTokenConfigEvent,
  AddedCollateralTokenConfig as AddedCollateralTokenConfigEvent,
  MarketConfigurationCreated as MarketConfigurationCreatedEvent,
} from '../generated/templates/ConfigController/ConfigController';
import { logEvent } from './utils/log-event';
import { createBaseConfiguration } from './helpers/create-base-configuration';
import { createCollateralConfiguration } from './helpers/create-collateral-configuration';
import { createCurveSecondsRate } from './helpers/create-curve';
import { createMarketConfiguration } from './helpers/create-market-configuration';

export function handleMarketConfigurationCreated(
  event: MarketConfigurationCreatedEvent
): void {
  logEvent(event);
  createMarketConfiguration(
    event.params.market,
    //
    event.params.baseToken,
    event.params.baseTokenId,
    event.params.priceFeed,
    //
    event.block.timestamp
  );
}

export function handleAddedBaseTokenConfig(
  event: AddedBaseTokenConfigEvent
): void {
  logEvent(event);

  const curve = createCurveSecondsRate(
    event.block.number.toString(), // TODO: replace with the real id
    //
    event.params.supplyKink,
    event.params.supplyPerSecondInterestRateBase,
    event.params.supplyPerSecondInterestRateSlopeLow,
    event.params.supplyPerSecondInterestRateSlopeHigh,
    event.params.borrowKink,
    event.params.borrowPerSecondInterestRateBase,
    event.params.borrowPerSecondInterestRateSlopeLow,
    event.params.borrowPerSecondInterestRateSlopeHigh,
    //
    event.block.timestamp
  );

  createBaseConfiguration(
    event.address,
    //
    curve.id,
    //
    event.block.timestamp
  );
}

export function handleAddedCollateralTokenConfig(
  event: AddedCollateralTokenConfigEvent
): void {
  logEvent(event);

  const decimals = BigInt.fromI32(event.params.decimals);
  createCollateralConfiguration(
    event.params.asset,
    //
    event.params.priceFeed,
    decimals,
    event.params.borrowCollateralFactor,
    event.params.liquidateCollateralFactor,
    event.params.liquidationFactor,
    event.params.supplyCap,
    //
    event.block.timestamp
  );
}
