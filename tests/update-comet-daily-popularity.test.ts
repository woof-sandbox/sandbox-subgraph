import { describe, test, beforeEach, assert, clearStore, newMockEvent } from 'matchstick-as';
import { updateCometDailyPopularity } from "../src/helpers/update-comet-daily-popularity";
import { Bytes, BigInt, Address, ethereum } from "@graphprotocol/graph-ts";
import { CometDailyPopularity } from "../generated/schema";
import { ONE_BI, SECONDS_PER_DAY } from '../src/constants';

const ADDRESS = Address.fromString("0x1234567890abcdef1234567890abcdef12345678");
const TIMESTAMP = BigInt.fromI32(1697059200); // 2023-10-12 00:00:00
const DAY = TIMESTAMP.div(SECONDS_PER_DAY);
const ID = Bytes.fromHexString(ADDRESS.toHexString() + DAY.toHexString());

function createMockEvent(address: Address, timestamp: BigInt): ethereum.Event {
  let event = changetype<ethereum.Event>(newMockEvent());
  event.address = address;
  event.block.timestamp = timestamp;
  return event;
}

function createCometDailyPopularity(id: Bytes, day: BigInt, createdAt: BigInt, count: BigInt): void {
  let entity = new CometDailyPopularity(id);
  entity.comet = id;
  entity.day = day;
  entity.createdAt = createdAt;
  entity.updatedAt = createdAt;
  entity.count = count;
  entity.save();
}

describe("updateCometDailyPopularity", () => {
  beforeEach(() => {
    clearStore();
  });

  test("should update existing CometDailyPopularity entity", () => {

    createCometDailyPopularity(ID, DAY, TIMESTAMP, ONE_BI);
    let event = createMockEvent(ADDRESS, TIMESTAMP.plus(BigInt.fromI32(3600))); // 1 hour later

    updateCometDailyPopularity(event);

    let updatedEntity = CometDailyPopularity.load(ID);
    assert.assertNotNull(updatedEntity, "Entity should exist");
    assert.bigIntEquals(updatedEntity!.count, ONE_BI.plus(ONE_BI), "Count should be incremented");
    assert.bigIntEquals(updatedEntity!.updatedAt, event.block.timestamp, "updatedAt should match event timestamp");
    assert.bigIntEquals(updatedEntity!.createdAt, TIMESTAMP, "createdAt should remain unchanged");
    assert.bigIntEquals(updatedEntity!.day, DAY, "day should remain unchanged");
  });

  test("should do nothing if CometDailyPopularity entity does not exist", () => {
    let event = createMockEvent(ADDRESS, TIMESTAMP);

    updateCometDailyPopularity(event);

    let entity = CometDailyPopularity.load(ID);
    assert.assertNull(entity, "No entity should exist");
  });
});