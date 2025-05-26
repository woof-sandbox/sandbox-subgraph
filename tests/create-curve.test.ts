import { BigInt } from '@graphprotocol/graph-ts';
import {
  afterEach,
  assert,
  beforeEach,
  clearStore,
  describe,
  test,
} from 'matchstick-as';
import { SECONDS_PER_YEAR } from '../src/constants';
import {
  createCurve,
  createCurveSecondsRate,
} from '../src/helpers/create-curve';

let id = 'test-curve';

let supplyKink = BigInt.fromI32(50);
let supplyBase = BigInt.fromI32(1);
let supplySlopeLow = BigInt.fromI32(2);
let supplySlopeHigh = BigInt.fromI32(3);
let borrowKink = BigInt.fromI32(60);
let borrowBase = BigInt.fromI32(4);
let borrowSlopeLow = BigInt.fromI32(5);
let borrowSlopeHigh = BigInt.fromI32(6);
let createdAt = BigInt.fromI32(999);

describe('createCurve', () => {
  beforeEach(() => {
    clearStore();
  });

  afterEach(() => {
    clearStore();
  });

  test('createCurve creates new BaseAssetCurve', () => {
    createCurve(
      id,
      supplyKink,
      supplyBase,
      supplySlopeLow,
      supplySlopeHigh,
      borrowKink,
      borrowBase,
      borrowSlopeLow,
      borrowSlopeHigh,
      createdAt
    );

    assert.fieldEquals(
      'BaseAssetCurve',
      id,
      'supplyKink',
      supplyKink.toString()
    );
    assert.fieldEquals(
      'BaseAssetCurve',
      id,
      'supplyPerYearInterestRateBase',
      supplyBase.toString()
    );
    assert.fieldEquals(
      'BaseAssetCurve',
      id,
      'supplyPerYearInterestRateSlopeLow',
      supplySlopeLow.toString()
    );
    assert.fieldEquals(
      'BaseAssetCurve',
      id,
      'supplyPerYearInterestRateSlopeHigh',
      supplySlopeHigh.toString()
    );
    assert.fieldEquals(
      'BaseAssetCurve',
      id,
      'borrowKink',
      borrowKink.toString()
    );
    assert.fieldEquals(
      'BaseAssetCurve',
      id,
      'borrowPerYearInterestRateBase',
      borrowBase.toString()
    );
    assert.fieldEquals(
      'BaseAssetCurve',
      id,
      'borrowPerYearInterestRateSlopeLow',
      borrowSlopeLow.toString()
    );
    assert.fieldEquals(
      'BaseAssetCurve',
      id,
      'borrowPerYearInterestRateSlopeHigh',
      borrowSlopeHigh.toString()
    );
    assert.fieldEquals('BaseAssetCurve', id, 'createdAt', createdAt.toString());
  });

  test('createCurve does not overwrite existing BaseAssetCurve', () => {
    const newBase = BigInt.fromI32(777);

    createCurve(
      id,
      supplyKink,
      supplyBase,
      supplySlopeLow,
      supplySlopeHigh,
      borrowKink,
      borrowBase,
      borrowSlopeLow,
      borrowSlopeHigh,
      createdAt
    );

    createCurve(
      id,
      supplyKink,
      newBase,
      supplySlopeLow,
      supplySlopeHigh,
      borrowKink,
      borrowBase,
      borrowSlopeLow,
      borrowSlopeHigh,
      createdAt
    );

    assert.fieldEquals(
      'BaseAssetCurve',
      id,
      'supplyPerYearInterestRateBase',
      supplyBase.toString()
    );
  });

  test('createCurveSecondsRate correctly multiplies rates by SECONDS_PER_YEAR', () => {
    createCurveSecondsRate(
      id,
      supplyKink,
      supplyBase,
      supplySlopeLow,
      supplySlopeHigh,
      borrowKink,
      borrowBase,
      borrowSlopeLow,
      borrowSlopeHigh,
      createdAt
    );

    assert.fieldEquals(
      'BaseAssetCurve',
      id,
      'supplyPerYearInterestRateBase',
      supplyBase.times(SECONDS_PER_YEAR).toString()
    );
    assert.fieldEquals(
      'BaseAssetCurve',
      id,
      'borrowPerYearInterestRateSlopeHigh',
      borrowSlopeHigh.times(SECONDS_PER_YEAR).toString()
    );
  });

  test('createCurve handles all zero values', () => {
    createCurve(
      'zero-curve',
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero(),
      BigInt.zero()
    );

    assert.fieldEquals('BaseAssetCurve', 'zero-curve', 'supplyKink', '0');
    assert.fieldEquals(
      'BaseAssetCurve',
      'zero-curve',
      'borrowPerYearInterestRateSlopeHigh',
      '0'
    );
  });

  test('createCurveSecondsRate multiplies all values by SECONDS_PER_YEAR', () => {
    let secondsBase = BigInt.fromI32(2);
    let secondsSlopeLow = BigInt.fromI32(3);
    let secondsSlopeHigh = BigInt.fromI32(4);
    let secondsBorrowBase = BigInt.fromI32(5);
    let secondsBorrowSlopeLow = BigInt.fromI32(6);
    let secondsBorrowSlopeHigh = BigInt.fromI32(7);

    createCurveSecondsRate(
      'seconds-curve',
      BigInt.fromI32(10),
      secondsBase,
      secondsSlopeLow,
      secondsSlopeHigh,
      BigInt.fromI32(20),
      secondsBorrowBase,
      secondsBorrowSlopeLow,
      secondsBorrowSlopeHigh,
      createdAt
    );

    assert.fieldEquals(
      'BaseAssetCurve',
      'seconds-curve',
      'supplyPerYearInterestRateBase',
      secondsBase.times(SECONDS_PER_YEAR).toString()
    );
    assert.fieldEquals(
      'BaseAssetCurve',
      'seconds-curve',
      'supplyPerYearInterestRateSlopeLow',
      secondsSlopeLow.times(SECONDS_PER_YEAR).toString()
    );
    assert.fieldEquals(
      'BaseAssetCurve',
      'seconds-curve',
      'supplyPerYearInterestRateSlopeHigh',
      secondsSlopeHigh.times(SECONDS_PER_YEAR).toString()
    );
    assert.fieldEquals(
      'BaseAssetCurve',
      'seconds-curve',
      'borrowPerYearInterestRateBase',
      secondsBorrowBase.times(SECONDS_PER_YEAR).toString()
    );
    assert.fieldEquals(
      'BaseAssetCurve',
      'seconds-curve',
      'borrowPerYearInterestRateSlopeLow',
      secondsBorrowSlopeLow.times(SECONDS_PER_YEAR).toString()
    );
    assert.fieldEquals(
      'BaseAssetCurve',
      'seconds-curve',
      'borrowPerYearInterestRateSlopeHigh',
      secondsBorrowSlopeHigh.times(SECONDS_PER_YEAR).toString()
    );
  });

  test('createCurve returns existing entity without overwriting', () => {
    let entity = createCurve(
      id,
      supplyKink,
      supplyBase,
      supplySlopeLow,
      supplySlopeHigh,
      borrowKink,
      borrowBase,
      borrowSlopeLow,
      borrowSlopeHigh,
      createdAt
    );

    let second = createCurve(
      id,
      BigInt.fromI32(999),
      BigInt.fromI32(888),
      BigInt.fromI32(777),
      BigInt.fromI32(666),
      BigInt.fromI32(555),
      BigInt.fromI32(444),
      BigInt.fromI32(333),
      BigInt.fromI32(222),
      BigInt.fromI32(111)
    );

    assert.bigIntEquals(entity.supplyKink, second.supplyKink);
    assert.bigIntEquals(second.supplyPerYearInterestRateBase, supplyBase);
    assert.bigIntEquals(second.createdAt, createdAt);
  });

  test('createCurve creates multiple distinct BaseAssetCurves', () => {
    createCurve(
      'curve1',
      BigInt.fromI32(1),
      BigInt.fromI32(2),
      BigInt.fromI32(3),
      BigInt.fromI32(4),
      BigInt.fromI32(5),
      BigInt.fromI32(6),
      BigInt.fromI32(7),
      BigInt.fromI32(8),
      createdAt
    );
    createCurve(
      'curve2',
      BigInt.fromI32(10),
      BigInt.fromI32(11),
      BigInt.fromI32(12),
      BigInt.fromI32(13),
      BigInt.fromI32(14),
      BigInt.fromI32(15),
      BigInt.fromI32(16),
      BigInt.fromI32(17),
      createdAt
    );

    assert.fieldEquals('BaseAssetCurve', 'curve1', 'supplyKink', '1');
    assert.fieldEquals('BaseAssetCurve', 'curve2', 'supplyKink', '10');
  });
});
