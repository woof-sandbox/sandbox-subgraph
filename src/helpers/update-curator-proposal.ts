import { BigInt, log } from '@graphprotocol/graph-ts';
import { CuratorProposal, Progress } from '../../generated/schema';
import { ProgressId } from '../progress';

export function updateCuratorProposal(
  newStatus: string, // namespace ProposalStatus
  timestamp: BigInt
): CuratorProposal | null {
  let lastProposalProgress = Progress.load(ProgressId.LastCuratorProposal);
  if (!lastProposalProgress) {
    log.error('LastCuratorProposal not found: {}', [timestamp.toString()]);
    return null;
  }

  const curatorProposal = new CuratorProposal(lastProposalProgress.seekId);
  if (!curatorProposal) {
    log.error('CuratorProposal not found: {}', [lastProposalProgress.seekId]);
    return null;
  }

  curatorProposal.status = newStatus;
  curatorProposal.save();

  return curatorProposal;
}
