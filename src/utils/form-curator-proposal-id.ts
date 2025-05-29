import { Address, BigInt } from '@graphprotocol/graph-ts';

export function formCuratorProposalId(
  curatorAddress: Address,
  timestamp: BigInt
): string {
  return `${curatorAddress.toHexString()}:${timestamp}`;
}
