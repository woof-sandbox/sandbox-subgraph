import { Comet } from '../generated/templates';
import { CometCreated as CometCreatedEvent } from '../generated/MarketFactory/MarketFactory';
import { logEvent } from './utils/log-event';
import { createComet } from './helpers/create-comet';
import {
  getOrCreateMarket,
  getOrCreateMarketAccounting,
  updateMarketAccounting,
} from './helpers/external/market';

export function handleCometCreated(event: CometCreatedEvent): void {
  logEvent(event);
  createComet(
    event.params.comet,
    event.params.configController,
    event.block.timestamp
  );
  Comet.create(event.params.comet);

  // ?: move to helper
  const market = getOrCreateMarket(event.params.comet, event);
  const marketAccounting = getOrCreateMarketAccounting(market, event);
  updateMarketAccounting(market, marketAccounting, event);
}
