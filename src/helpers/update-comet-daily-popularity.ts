import { CometDailyPopularity } from '../../generated/schema';
import { Bytes, ethereum } from '@graphprotocol/graph-ts';
import { ONE_BI, SECONDS_PER_DAY } from '../constants';

export function updateCometDailyPopularity(event: ethereum.Event): void {
  const day = event.block.timestamp.div(SECONDS_PER_DAY);
  const id = Bytes.fromHexString(event.address .toHexString() + day.toHexString());

  let popularity = CometDailyPopularity.load(id);

  if (popularity) {
    popularity.count = popularity.count.plus(ONE_BI);
    popularity.updatedAt = event.block.timestamp;
    popularity.save();
  }
}
