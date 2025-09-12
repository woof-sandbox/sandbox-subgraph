import { Address, BigInt } from '@graphprotocol/graph-ts';
import { User } from '../../generated/schema';
import { fetchUserPrincipal } from './fetch-user-principal';
import { formUserId } from './form-user-id';

/**
 * @param cometAddress
 * @param userAddress
 * @param createdAt
 * @returns null if already exists
 */
export function createUser(
  cometAddress: Address,
  userAddress: Address,
  createdAt: BigInt
): User | null {
  const id = formUserId(cometAddress, userAddress);

  let user = User.load(id);
  if (!user) {
    user = new User(id);
    user.principal = fetchUserPrincipal(cometAddress, userAddress);
    user.userAddress = userAddress;
    user.comet = cometAddress;
    //
    user.createdAt = createdAt;
    user.updatedAt = createdAt;
    user.save();

    return user;
  }

  return null;
}
