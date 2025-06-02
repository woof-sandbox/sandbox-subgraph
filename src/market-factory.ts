import { Comet } from '../generated/templates';
import { MarketCreated as MarketCreatedEvent } from '../generated/MarketFactory/MarketFactory';
import { logEvent } from './utils/log-event';
import { createComet } from './helpers/create-comet';

export function handleMarketCreated(event: MarketCreatedEvent): void {
  logEvent(event);
  createComet(
    event.params.market,
    event.params.configController,
    event.block.timestamp
  );
  Comet.create(event.params.market);
}
