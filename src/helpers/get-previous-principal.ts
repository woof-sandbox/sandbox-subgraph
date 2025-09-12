import { Address, BigInt } from '@graphprotocol/graph-ts';
import { PreviousUser } from '../../generated/schema';
import { formUserId } from './form-user-id';

export function getPreviousPrincipal(
  cometAddress: Address,
  userAddress: Address
): BigInt | null {
  const userId = formUserId(cometAddress, userAddress);
  let previous = PreviousUser.load(userId);

  if (!previous) {
    return null;
  }

  return previous.principal;
}
