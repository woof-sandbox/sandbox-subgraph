import { BigInt } from '@graphprotocol/graph-ts';
import {
  AddedBaseTokenConfig as AddedBaseTokenConfigEvent,
  AddedCollateralTokenConfig as AddedCollateralTokenConfigEvent,
  CuratorAccepted as CuratorAcceptedEvent,
  CuratorCanceled as CuratorCanceledEvent,
  CuratorProposalCancelled as CuratorProposalCancelledEvent,
  CuratorProposed as CuratorProposedEvent,
  GuardianUpdated as GuardianUpdatedEvent,
} from '../generated/templates/ConfigController/ConfigController';
import { logEvent } from './utils/log-event';
import { createBaseConfiguration } from './helpers/create-base-configuration';
import { createCollateralConfiguration } from './helpers/create-collateral-configuration';
import { createCuratorProposal } from './helpers/create-curator-proposal';
import { createCurveSecondsRate } from './helpers/create-curve';
import { getConfigController } from './helpers/get-config-controller';
import { updateCuratorProposal } from './helpers/update-curator-proposal';
import { ProposalStatus } from './common/proposal-status';

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
