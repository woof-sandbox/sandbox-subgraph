import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Comet } from '../../generated/templates/Comet/Comet';

export function getUserPrincipal(
  cometAddress: Address,
  userAddress: Address
): BigInt {
  let cometContract = Comet.bind(cometAddress);
  let userBasic = cometContract.try_userBasic(userAddress);

  if (userBasic.reverted) {
    return BigInt.fromI32(0);
  }

  return userBasic.value.value0;
}
