import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { clearStore, test, assert, describe, beforeAll, afterAll } from 'matchstick-as/assembly/index';
import { createComet } from '../src/helpers/create-comet';

describe("createComet tests", () => {
  beforeAll(() => {
    let address = Address.fromString("0x0000000000000000000000000000000000000001");
    let createdAt = BigInt.fromI32(1633024800);

    createComet(address, createdAt);
  });

  afterAll(() => {
    clearStore();
  });

  test("Comet entity created and stored", () => {
    let cometId = Bytes.fromHexString("0x0000000000000000000000000000000000000001").toHexString();

    assert.entityCount("Comet", 1);

    assert.fieldEquals(
      "Comet",
      cometId,
      "createdAt",
      "1633024800"
    );
  });
});