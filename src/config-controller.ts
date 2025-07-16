import {
  CometCreated as CometCreatedEvent,
  CuratorAccepted as CuratorAcceptedEvent,
  CuratorCanceled as CuratorCanceledEvent,
  CuratorProposalCancelled as CuratorProposalCancelledEvent,
  CuratorProposed as CuratorProposedEvent,
  GuardianUpdated as GuardianUpdatedEvent,
} from '../generated/templates/ConfigController/ConfigController';
import { logEvent } from './utils/log-event';
import { createBaseConfiguration } from './helpers/create-base-configuration';
import { createCuratorProposal } from './helpers/create-curator-proposal';
import { formCurveId } from './helpers/form-curve-id';
import { getConfigController } from './helpers/get-config-controller';
import { updateCuratorProposal } from './helpers/update-curator-proposal';
import { ProposalStatus } from './common/proposal-status';

export function handleCometCreated(event: CometCreatedEvent): void {
  logEvent(event);

  createBaseConfiguration(
    event.address,
    //
    formCurveId(event.params.baseToken, event.params.baseTokenCurveId),
    //
    event.block.timestamp
  );
}

/*export function handleAddedCollateralTokenConfig(
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
}*/

/// ROLES

export function handleCuratorProposed(event: CuratorProposedEvent): void {
  logEvent(event);

  createCuratorProposal(
    event.address,
    event.params.proposedCurator,
    event.params.expiry,
    event.block.timestamp
  );
}

export function handleCuratorAccepted(event: CuratorAcceptedEvent): void {
  logEvent(event);

  updateCuratorProposal(
    event.address,
    ProposalStatus.Accepted,
    event.block.timestamp
  );

  const controller = getConfigController(event.address);
  if (!controller) return;

  controller.curator = event.params.newCurator;
  controller.updatedAt = event.block.timestamp;
  controller.save();
}

export function handleCuratorCanceled(event: CuratorCanceledEvent): void {
  logEvent(event);

  const controller = getConfigController(event.address);
  if (!controller) return;

  controller.curator = null;
  controller.updatedAt = event.block.timestamp;
  controller.save();
}

export function handleCuratorProposalCancelled(
  event: CuratorProposalCancelledEvent
): void {
  logEvent(event);

  updateCuratorProposal(
    event.address,
    ProposalStatus.Canceled,
    event.block.timestamp
  );
}

export function handleGuardianUpdated(event: GuardianUpdatedEvent): void {
  logEvent(event);

  const controller = getConfigController(event.address);
  if (!controller) return;

  controller.guardian = event.params.newGuardian;
  controller.updatedAt = event.block.timestamp;
  controller.save();
}
