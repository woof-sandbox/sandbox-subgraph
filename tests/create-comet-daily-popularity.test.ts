import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { assert, clearStore, test } from 'matchstick-as';
import { SECONDS_PER_DAY } from '../src/constants';
import { createInitialCometDailyPopularity } from '../src/helpers/create-comet-daily-popularity';

test('createInitialCometDailyPopularity creates entity correctly', () => {
  clearStore();

  const comet = Address.fromString(
    '0x000000000000000000000000000000000000c0de'
  );
  const createdAt = BigInt.fromI32(1728000000); // Day = 20000
  const day = createdAt.div(SECONDS_PER_DAY);
  const id = Bytes.fromHexString(comet.toHexString() + day.toHexString());

  // Call the function
  createInitialCometDailyPopularity(comet, createdAt);

  // Assertions
  assert.entityCount('CometDailyPopularity', 1);

  assert.fieldEquals(
    'CometDailyPopularity',
    id.toHexString(),
    'comet',
    id.toHexString()
  );
  assert.fieldEquals(
    'CometDailyPopularity',
    id.toHexString(),
    'day',
    day.toString()
  );
  assert.fieldEquals(
    'CometDailyPopularity',
    id.toHexString(),
    'createdAt',
    createdAt.toString()
  );
  assert.fieldEquals(
    'CometDailyPopularity',
    id.toHexString(),
    'updatedAt',
    createdAt.toString()
  );
  assert.fieldEquals('CometDailyPopularity', id.toHexString(), 'count', '1');
});
