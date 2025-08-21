import { ConfigController } from '../generated/templates';
import { ConfigControllerCreated as ConfigControllerCreatedEvent } from '../generated/ConfigControllerFactory/ConfigControllerFactory';
import { logEvent } from './common/utils/log-event';
import { createConfigController } from './helpers/create-config-controller';

export function handleConfigControllerCreated(
  event: ConfigControllerCreatedEvent
): void {
  logEvent(event);
  createConfigController(
    event.params.controller,
    //
    event.params.owner,
    event.params.guardian,
    event.params.marketFactory,
    //
    event.params.curatorFee,
    event.params.name,
    event.params.curatorProposalDuration,
    event.params.proposalDuration,
    //
    event.block.timestamp
  );
  ConfigController.create(event.params.controller);
}
