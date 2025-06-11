import { Address, BigInt } from '@graphprotocol/graph-ts';
import { CometDailyPopularity } from '../../generated/schema';
import { ONE_BI, SECONDS_PER_DAY } from '../constants';

export function createOrUpdateCometDailyPopularity(
  address: Address,
  timestamp: BigInt
): CometDailyPopularity {
  const day = timestamp.div(SECONDS_PER_DAY);
  const id = `${address.toHexString()}:${day.toString()}`;

  let popularity = CometDailyPopularity.load(id);

  if (!popularity) {
    popularity = new CometDailyPopularity(id);
    popularity.comet = address;
    popularity.count = BigInt.zero();
    popularity.day = day;
    popularity.createdAt = timestamp;
  }

  popularity.count = popularity.count.plus(ONE_BI);
  popularity.updatedAt = timestamp;
  popularity.save();

  return popularity;
}
