import { Address, BigInt } from '@graphprotocol/graph-ts';
import { User } from '../../generated/schema';
import { formUserId } from './form-user-id';
import { getUserPrincipal } from './get-user-principal';

export function createUser(
  proxyCometAddress: Address,
  userAddress: Address,
  createdAt: BigInt
): User {
  const id = formUserId(proxyCometAddress, userAddress);

  let user = User.load(id);
  if (!user) {
    user = new User(id);
    user.principal = getUserPrincipal(proxyCometAddress, userAddress);
    user.userAddress = userAddress;
    user.proxyCometAddress = proxyCometAddress;
    //
    user.createdAt = createdAt;
    user.updatedAt = createdAt;
    user.save();
  }

  return user;
}
