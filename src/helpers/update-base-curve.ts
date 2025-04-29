import { Address, BigInt, Bytes, log } from '@graphprotocol/graph-ts';
import { WhitelistedBase } from '../../generated/schema';

export function updateBaseCurve(
  address: Address,
  //
  newCurveId: string,
  //
  updatedAt: BigInt,
): void {
  const id = Bytes.fromHexString(address.toHexString());

  let base = WhitelistedBase.load(id);
  if (base) {
    base.curve = newCurveId;

    base.updatedAt = updatedAt;
    base.save();
  } else {
    log.error('WhitelistedBase does not exist: {}', [address.toHexString()]);
  }
}
