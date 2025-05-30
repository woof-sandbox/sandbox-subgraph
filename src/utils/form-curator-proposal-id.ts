import { Address, BigInt } from '@graphprotocol/graph-ts';

export function formCuratorProposalId(
  configControllerAddress: Address,
  proposedCuratorAddress: Address,
  timestamp: BigInt
): string {
  return `${configControllerAddress.toHexString()}:${proposedCuratorAddress.toHexString()}:${timestamp}`;
}
