import { Address, BigInt } from '@graphprotocol/graph-ts';

export function createCuratorProposalId(
  curatorAddress: Address,
  timestamp: BigInt
): string {
  return `${curatorAddress}:${timestamp}`;
}
