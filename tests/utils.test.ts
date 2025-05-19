import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { afterEach, assert, clearStore, describe, test } from 'matchstick-as';
import {
  bigDecimalMax,
  bigDecimalMin,
  bigDecimalSafeDiv,
  bigIntMax,
  bigIntMin,
  bigIntSafeDiv,
  bigIntSafeMinus,
  computeTokenValueUsd,
  formatUnits,
  parseUnits,
  presentValue,
  principalValue,
} from '../src/common/paperclip/utils';
import {
  BASE_INDEX_SCALE,
  ZERO_BD,
  ZERO_BI,
} from '../src/common/paperclip/constants';

describe('utils', () => {
  afterEach(() => {
    clearStore();
  });

  test('formatUnits divides by 10^exponent', () => {
    const result = formatUnits(BigInt.fromString('1000000000000000000'), 18);
    assert.stringEquals(result.toString(), '1');
  });

  test('parseUnits multiplies by 10^exponent', () => {
    const result = parseUnits(BigDecimal.fromString('1.5'), 6);
    assert.bigIntEquals(result, BigInt.fromString('1500000'));
  });

  test('computeTokenValueUsd calculates correctly', () => {
    const amount = BigInt.fromString('50000000');
    const decimals: u8 = 6;
    const price = BigDecimal.fromString('2.5');
    const result = computeTokenValueUsd(amount, decimals, price);
    assert.stringEquals(result.toString(), '125');
  });

  test('presentValue = principal * index / BASE_INDEX_SCALE', () => {
    const principal = BigInt.fromI32(1000);
    const index = BigInt.fromI32(2).times(BASE_INDEX_SCALE);
    const result = presentValue(principal, index);
    assert.bigIntEquals(result, BigInt.fromI32(2000));
  });

  test('principalValue = presentValue * BASE_INDEX_SCALE / index', () => {
    const present = BigInt.fromI32(2000);
    const index = BigInt.fromI32(2).times(BASE_INDEX_SCALE);
    const result = principalValue(present, index);
    assert.bigIntEquals(result, BigInt.fromI32(1000));
  });

  test('bigDecimalSafeDiv returns 0 on div by zero', () => {
    const result = bigDecimalSafeDiv(BigDecimal.fromString('10'), ZERO_BD);
    assert.stringEquals(result.toString(), '0');
  });

  test('bigDecimalSafeDiv returns correct division', () => {
    const result = bigDecimalSafeDiv(
      BigDecimal.fromString('10'),
      BigDecimal.fromString('2')
    );
    assert.stringEquals(result.toString(), '5');
  });

  test('bigDecimalMin returns minimum', () => {
    const result = bigDecimalMin(
      BigDecimal.fromString('1.1'),
      BigDecimal.fromString('1.2')
    );
    assert.stringEquals(result.toString(), '1.1');
  });

  test('bigDecimalMax returns maximum', () => {
    const result = bigDecimalMax(
      BigDecimal.fromString('1.1'),
      BigDecimal.fromString('1.2')
    );
    assert.stringEquals(result.toString(), '1.2');
  });

  test('bigIntMin returns minimum', () => {
    const result = bigIntMin(BigInt.fromI32(10), BigInt.fromI32(20));
    assert.bigIntEquals(result, BigInt.fromI32(10));
  });

  test('bigIntMax returns maximum', () => {
    const result = bigIntMax(BigInt.fromI32(10), BigInt.fromI32(20));
    assert.bigIntEquals(result, BigInt.fromI32(20));
  });

  test('bigIntSafeMinus clamps at 0', () => {
    const result = bigIntSafeMinus(BigInt.fromI32(5), BigInt.fromI32(10));
    assert.bigIntEquals(result, ZERO_BI);
  });

  test('bigIntSafeMinus subtracts when a >= b', () => {
    const result = bigIntSafeMinus(BigInt.fromI32(10), BigInt.fromI32(5));
    assert.bigIntEquals(result, BigInt.fromI32(5));
  });

  test('bigIntSafeDiv returns 0 on division by zero', () => {
    const result = bigIntSafeDiv(BigInt.fromI32(10), ZERO_BI);
    assert.bigIntEquals(result, ZERO_BI);
  });

  test('bigIntSafeDiv performs valid division', () => {
    const result = bigIntSafeDiv(BigInt.fromI32(10), BigInt.fromI32(2));
    assert.bigIntEquals(result, BigInt.fromI32(5));
  });
});
