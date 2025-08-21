import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { WhitelistedCollateral } from '../../generated/schema';

export function createWhitelistedCollateral(
  address: Address,
  //
  priceFeed: Address,
  decimals: BigInt,
  //
  createdAt: BigInt
): WhitelistedCollateral {
  const id = Bytes.fromHexString(address.toHexString());

  let collateral = WhitelistedCollateral.load(id);
  if (!collateral) {
    collateral = new WhitelistedCollateral(id);
    //
    collateral.priceFeed = priceFeed;
    collateral.decimals = decimals;
    //
    collateral.createdAt = createdAt;
    collateral.save();
  }

  return collateral;
}
