import { MarketCreated as MarketCreatedEvent } from '../generated/MarketFactory/MarketFactory';
import { Comet } from '../generated/templates';
import { createComet } from './helpers/create-comet';

export function handleMarketCreated(event: MarketCreatedEvent): void {
  createComet(
    event.params.market,
    event.params.configController,
    event.block.timestamp,
  );
  Comet.create(event.params.market);
}
