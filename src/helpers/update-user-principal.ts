import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Comet } from '../../generated/templates/Comet/Comet';
import { User } from '../../generated/schema';
import { formUserId } from './form-user-id';

export function updateUserPrincipal(
  cometAddress: Address,
  userAddress: Address,
  updatedAt: BigInt
): void {
  const userId = formUserId(cometAddress, userAddress);
  let user = User.load(userId);

  if (user) {
    let cometContract = Comet.bind(cometAddress);
    let userBasic = cometContract.userBasic(userAddress);
    user.principal = userBasic.value0;
    //
    user.updatedAt = updatedAt;
    user.save();
  }
}
