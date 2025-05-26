import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import {
  afterEach,
  assert,
  beforeEach,
  clearStore,
  describe,
  test,
} from 'matchstick-as';
import { WhitelistedBase } from '../generated/schema';
import { updateBaseCurve } from '../src/helpers/update-base-curve';

let address = Address.fromString('0x000000000000000000000000000000000000dead');
let id = Bytes.fromHexString(address.toHexString()) as Bytes;
let initialCurve = 'curve-1';
let updatedCurve = 'curve-2';
let updatedAt = BigInt.fromI32(1000);

describe('updateBaseCurve', () => {
  beforeEach(() => {
    let base = new WhitelistedBase(id);
    base.curve = initialCurve;
    base.priceFeed = Bytes.fromHexString(
      '0x0000000000000000000000000000000000000001'
    ) as Bytes;
    base.decimals = BigInt.fromI32(18);
    base.minBorrow = BigInt.fromI32(0);
    base.updatedAt = BigInt.fromI32(0);
    base.createdAt = BigInt.fromI32(0);
    base.save();
  });

  afterEach(() => {
    clearStore();
  });

  test('updateBaseCurve updates existing WhitelistedBase correctly', () => {
    updateBaseCurve(address, updatedCurve, updatedAt);

    assert.fieldEquals(
      'WhitelistedBase',
      id.toHexString(),
      'curve',
      updatedCurve
    );
    assert.fieldEquals(
      'WhitelistedBase',
      id.toHexString(),
      'updatedAt',
      updatedAt.toString()
    );
  });

  test('updateBaseCurve does not change unrelated fields', () => {
    const originalDecimals = BigInt.fromI32(18);
    const originalCreatedAt = BigInt.fromI32(0);

    updateBaseCurve(address, 'curve-updated', BigInt.fromI32(1111));

    assert.fieldEquals(
      'WhitelistedBase',
      id.toHexString(),
      'decimals',
      originalDecimals.toString()
    );
    assert.fieldEquals(
      'WhitelistedBase',
      id.toHexString(),
      'createdAt',
      originalCreatedAt.toString()
    );
  });

  test('updateBaseCurve handles multiple updates', () => {
    updateBaseCurve(address, 'curve-1', BigInt.fromI32(100));
    updateBaseCurve(address, 'curve-2', BigInt.fromI32(200));

    assert.fieldEquals('WhitelistedBase', id.toHexString(), 'curve', 'curve-2');
    assert.fieldEquals('WhitelistedBase', id.toHexString(), 'updatedAt', '200');
  });

  test('updateBaseCurve updates curve and updatedAt fields', () => {
    const newCurve = 'new-curve';
    const newUpdatedAt = BigInt.fromI32(1234);

    updateBaseCurve(address, newCurve, newUpdatedAt);

    assert.fieldEquals('WhitelistedBase', id.toHexString(), 'curve', newCurve);
    assert.fieldEquals(
      'WhitelistedBase',
      id.toHexString(),
      'updatedAt',
      newUpdatedAt.toString()
    );
  });

  test('updateBaseCurve does nothing if WhitelistedBase does not exist', () => {
    clearStore();

    updateBaseCurve(address, 'should-not-be-set', BigInt.fromI32(9999));

    assert.notInStore('WhitelistedBase', id.toHexString());
  });
});
