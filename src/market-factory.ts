import { Comet } from '../generated/templates';
import { MarketCreated as MarketCreatedEvent } from '../generated/MarketFactory/MarketFactory';
import { logEvent } from './utils/log-event';
import { createComet } from './helpers/create-comet';
import { createInitialCometDailyPopularity } from './helpers/create-comet-daily-popularity';

export function handleMarketCreated(event: MarketCreatedEvent): void {
  logEvent(event);
  createComet(
    event.params.market,
    event.params.configController,
    event.block.timestamp
  );
  createInitialCometDailyPopularity(event.params.market, event.block.timestamp);
  Comet.create(event.params.market);
}
