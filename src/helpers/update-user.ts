import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Comet } from '../../generated/templates/Comet/Comet';
import { PreviousUser, User } from '../../generated/schema';
import { formUserId } from './form-user-id';

export function updateUser(
  cometAddress: Address,
  userAddress: Address,
  updatedAt: BigInt
): void {
  const userId = formUserId(cometAddress, userAddress);
  let user = User.load(userId);

  if (user) {
    let previous = PreviousUser.load(userId);
    if (!previous) {
      previous = new PreviousUser(userId);
      previous.comet = user.comet;
      previous.userAddress = userAddress;
      previous.createdAt = updatedAt;
    }
    previous.principal = user.principal;
    previous.updatedAt = updatedAt;
    previous.save();

    let cometContract = Comet.bind(cometAddress);
    let userBasic = cometContract.userBasic(userAddress);
    user.principal = userBasic.value0;
    //
    user.updatedAt = updatedAt;
    user.save();
  }
}
