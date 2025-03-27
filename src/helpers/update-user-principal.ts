import { Address } from '@graphprotocol/graph-ts'
import { User } from '../../generated/schema';
import { createUserId } from './create-user';
import { Comet } from '../../generated/templates/Comet/Comet';

export function updateUserPrincipal(proxyCometAddress: Address, userAddress: Address): void {
  let userId = createUserId(proxyCometAddress, userAddress);
  let user = User.load(userId);

  if (user) {
    let cometContract = Comet.bind(proxyCometAddress);
    let userBasic = cometContract.userBasic(userAddress);
    user.principal = userBasic.value0;
    user.save();
  }
}