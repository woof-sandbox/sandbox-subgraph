import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Comet } from '../../generated/schema';

export function createComet(
  address: Address,
  configController: Address,
  createdAt: BigInt
): Comet {
  const id = Bytes.fromHexString(address.toHexString());

  let comet = Comet.load(id);
  if (!comet) {
    comet = new Comet(id);
    comet.configController = configController;
    comet.createdAt = createdAt;

    comet.save();
  }

  return comet;
}
