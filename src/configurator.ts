import { CometDeployed as CometDeployedEvent } from '../generated/Configurator/Configurator';
import { Comet } from '../generated/templates';
import { createComet } from './helpers/create-comet';

export function handleCometDeployed(event: CometDeployedEvent): void {
  createComet(event.params.cometProxy, event.block.timestamp);
  Comet.create(event.params.cometProxy);
}
