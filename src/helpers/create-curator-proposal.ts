import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { CuratorProposal } from '../../generated/schema';
import { formCuratorProposalId } from '../utils/form-curator-proposal-id';
import { ProposalStatus } from '../common/proposal-status';
import { ProgressId, createOrUpdateProgress, getProgress } from '../progress';

export function createCuratorProposal(
  configController: Address,
  proposedCurator: Address,
  expiry: BigInt,
  timestamp: BigInt
): CuratorProposal {
  const curatorProposal = new CuratorProposal(
    formCuratorProposalId(configController, proposedCurator, timestamp)
  );
  curatorProposal.configController = configController;
  curatorProposal.proposedCurator = proposedCurator;
  curatorProposal.expiry = expiry;

  curatorProposal.status = ProposalStatus.Pending;
  curatorProposal.createdAt = timestamp;
  curatorProposal.updatedAt = timestamp;
  curatorProposal.save();

  const progressId = ProgressId.LastCuratorProposal(configController);

  let lastProposalProgress = getProgress(progressId);
  if (lastProposalProgress) {
    const lastProposal = CuratorProposal.load(lastProposalProgress.id);

    if (lastProposal) {
      if (lastProposal.status === ProposalStatus.Pending) {
        lastProposal.status = ProposalStatus.Canceled;
        lastProposal.updatedAt = timestamp;

        lastProposal.save();
      }
    } else {
      log.error('Progress exists, but last proposal not found: {}', [
        proposedCurator.toHexString(),
      ]);
    }
  }

  createOrUpdateProgress(progressId, curatorProposal.id, timestamp);

  return curatorProposal;
}
