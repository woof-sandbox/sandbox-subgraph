import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { CuratorProposal } from '../../generated/schema';
import { createCuratorProposalId } from '../utils/create-curator-proposal-id';
import { ProposalStatus } from '../common/proposal-status';
import { createOrUpdateProgress, getProgress, ProgressId } from '../progress';

export function createCuratorProposal(
  proposedCuratorAddress: Address,
  expiry: BigInt,
  timestamp: BigInt
): CuratorProposal {
  const curatorProposal = new CuratorProposal(
    createCuratorProposalId(proposedCuratorAddress, timestamp)
  );
  curatorProposal.proposedCurator = proposedCuratorAddress;
  curatorProposal.expiry = expiry;

  curatorProposal.status = ProposalStatus.Pending;
  curatorProposal.createdAt = timestamp;
  curatorProposal.updatedAt = timestamp;
  curatorProposal.save();

  let lastProposalProgress = getProgress(ProgressId.LastCuratorProposal);
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
        proposedCuratorAddress.toHexString(),
      ]);
    }
  }

  createOrUpdateProgress(ProgressId.LastCuratorProposal, curatorProposal.id, timestamp);

  return curatorProposal;
}
