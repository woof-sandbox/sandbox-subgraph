import { Address } from '@graphprotocol/graph-ts';
import { User } from '../../generated/schema';
import { Comet } from '../../generated/templates/Comet/Comet';
import { formUserId } from './form-user-id';

export function updateUserPrincipal(
  proxyCometAddress: Address,
  userAddress: Address,
): void {
  const userId = formUserId(proxyCometAddress, userAddress);
  let user = User.load(userId);

  if (user) {
    let cometContract = Comet.bind(proxyCometAddress);
    let userBasic = cometContract.userBasic(userAddress);
    user.principal = userBasic.value0;
    user.save();
  }
}
