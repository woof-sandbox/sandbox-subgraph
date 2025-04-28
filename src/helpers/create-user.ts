import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { User } from '../../generated/schema';
import { Comet } from '../../generated/templates/Comet/Comet';
import { formUserId } from './form-user-id';

// Used locally
function getUserPrincipal(
  proxyCometAddress: Address,
  userAddress: Address,
): BigInt {
  let cometContract = Comet.bind(proxyCometAddress);
  let userBasic = cometContract.try_userBasic(userAddress);

  if (userBasic.reverted) {
    return BigInt.fromI32(0);
  }

  return userBasic.value.value0;
}

export function createUser(
  proxyCometAddress: Address,
  userAddress: Address,
  createdAt: BigInt,
): User {
  const id = formUserId(proxyCometAddress, userAddress);

  let user = User.load(id);
  if (!user) {
    user = new User(id);
    user.principal = getUserPrincipal(proxyCometAddress, userAddress);
    user.userAddress = userAddress;
    user.proxyCometAddress = proxyCometAddress;
    user.createdAt = createdAt;

    user.save();
  }

  return user;
}
