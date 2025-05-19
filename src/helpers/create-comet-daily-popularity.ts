import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { CometDailyPopularity } from '../../generated/schema';
import { ONE_BI, SECONDS_PER_DAY } from '../constants';

export function createInitialCometDailyPopularity(
  address: Address,
  createdAt: BigInt
): void {
  const day = createdAt.div(SECONDS_PER_DAY);
  const id = Bytes.fromHexString(address.toHexString() + day.toHexString());

  const existing = CometDailyPopularity.load(id);
  if (existing) return;

  const popularity = new CometDailyPopularity(id);
  popularity.comet = id;
  popularity.day = day;
  popularity.createdAt = createdAt;
  popularity.updatedAt = createdAt;
  popularity.count = ONE_BI;

  popularity.save();
}
