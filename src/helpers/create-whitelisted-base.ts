import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { WhitelistedBase } from '../../generated/schema';

export function createWhitelistedBase(
  address: Address,
  //
  priceFeed: Address,
  decimals: BigInt,
  //
  curveId: string,
  //
  minBorrow: BigInt,
  //
  createdAt: BigInt
): WhitelistedBase {
  const id = Bytes.fromHexString(address.toHexString());

  let base = WhitelistedBase.load(id);
  if (!base) {
    base = new WhitelistedBase(id);
    //
    base.priceFeed = priceFeed;
    base.decimals = decimals;
    //
    base.curve = curveId;
    //
    base.minBorrow = minBorrow;
    //
    base.createdAt = createdAt;
    base.updatedAt = createdAt;
    base.save();
  }

  return base;
}
