import { Address } from '@graphprotocol/graph-ts';

export function formUserId(
  cometAddress: Address,
  userAddress: Address
): string {
  return `${cometAddress.toHexString()}:${userAddress.toHexString()}`;
}
