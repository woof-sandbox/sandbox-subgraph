import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { User } from '../../generated/schema';
import { Comet } from '../../generated/templates/Comet/Comet';

export function createUserId(
  proxyCometAddress: Address,
  userAddress: Address,
): Bytes {
  return Bytes.fromHexString(
    proxyCometAddress.toHexString() + userAddress.toHexString(),
  );
}

export function createUserPrincipal(
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
): void {
  let user = User.load(
    createUserId(proxyCometAddress, userAddress),
  );
  if (!user) {
    user = new User(createUserId(proxyCometAddress, userAddress));
    user.principal = createUserPrincipal(
      proxyCometAddress,
      userAddress,
    );
    user.userAddress = userAddress;
    user.proxyCometAddress = proxyCometAddress;
    user.createdAt = createdAt;

    user.save();
  }
}
