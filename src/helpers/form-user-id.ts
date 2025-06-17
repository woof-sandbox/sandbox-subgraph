import { Address, Bytes } from '@graphprotocol/graph-ts';

export function formUserId(cometAddress: Address, userAddress: Address): Bytes {
  return Bytes.fromHexString(
    cometAddress.toHexString() + userAddress.toHexString()
  );
}
