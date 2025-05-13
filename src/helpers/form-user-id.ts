import { Address, Bytes } from '@graphprotocol/graph-ts';

export function formUserId(
  proxyCometAddress: Address,
  userAddress: Address
): Bytes {
  return Bytes.fromHexString(
    proxyCometAddress.toHexString() + userAddress.toHexString()
  );
}
