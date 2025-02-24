import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Comet } from '../../generated/schema';

export function createComet(address: Address, createdAt: BigInt): void {
  let comet = Comet.load(Bytes.fromHexString(address.toHexString()));
  if (!comet) {
    comet = new Comet(Bytes.fromHexString(address.toHexString()));
    comet.createdAt = createdAt;

    comet.save();
  }
}
