import { newMockEvent } from 'matchstick-as';
import { ethereum, Address } from '@graphprotocol/graph-ts';
import { MarketCreated as MarketCreatedEvent } from '../generated/MarketFactory/MarketFactory';

export function createCometDeployedEvent(
  market: Address,
  configController: Address,
): MarketCreatedEvent {
  let cometDeployedEvent = changetype<MarketCreatedEvent>(newMockEvent());

  cometDeployedEvent.parameters = [];

  cometDeployedEvent.parameters.push(
    new ethereum.EventParam('market', ethereum.Value.fromAddress(market)),
  );
  cometDeployedEvent.parameters.push(
    new ethereum.EventParam(
      'configController',
      ethereum.Value.fromAddress(configController),
    ),
  );

  return cometDeployedEvent;
}
