import { BigInt } from '@graphprotocol/graph-ts';
import { BaseAssetCurve } from '../../generated/schema';
import { SECONDS_PER_YEAR } from '../constants';

export function createCurve(
  id: string,
  //
  supplyKink: BigInt,
  supplyPerYearInterestRateBase: BigInt,
  supplyPerYearInterestRateSlopeLow: BigInt,
  supplyPerYearInterestRateSlopeHigh: BigInt,
  borrowKink: BigInt,
  borrowPerYearInterestRateBase: BigInt,
  borrowPerYearInterestRateSlopeLow: BigInt,
  borrowPerYearInterestRateSlopeHigh: BigInt,
  //
  createdAt: BigInt
): BaseAssetCurve {
  let curve = BaseAssetCurve.load(id);
  if (!curve) {
    curve = new BaseAssetCurve(id);
    //
    curve.supplyKink = supplyKink;
    curve.supplyPerYearInterestRateBase = supplyPerYearInterestRateBase;
    curve.supplyPerYearInterestRateSlopeLow = supplyPerYearInterestRateSlopeLow;
    curve.supplyPerYearInterestRateSlopeHigh =
      supplyPerYearInterestRateSlopeHigh;
    curve.borrowKink = borrowKink;
    curve.borrowPerYearInterestRateBase = borrowPerYearInterestRateBase;
    curve.borrowPerYearInterestRateSlopeLow = borrowPerYearInterestRateSlopeLow;
    curve.borrowPerYearInterestRateSlopeHigh =
      borrowPerYearInterestRateSlopeHigh;
    //
    curve.createdAt = createdAt;
    curve.save();
  }

  return curve;
}

export function createCurveSecondsRate(
  id: string,
  //
  supplyKink: BigInt,
  supplyPerSecondInterestRateBase: BigInt,
  supplyPerSecondInterestRateSlopeLow: BigInt,
  supplyPerSecondInterestRateSlopeHigh: BigInt,
  borrowKink: BigInt,
  borrowPerSecondInterestRateBase: BigInt,
  borrowPerSecondInterestRateSlopeLow: BigInt,
  borrowPerSecondInterestRateSlopeHigh: BigInt,
  //
  createdAt: BigInt
): BaseAssetCurve {
  return createCurve(
    id,
    supplyKink,
    supplyPerSecondInterestRateBase.times(SECONDS_PER_YEAR),
    supplyPerSecondInterestRateSlopeLow.times(SECONDS_PER_YEAR),
    supplyPerSecondInterestRateSlopeHigh.times(SECONDS_PER_YEAR),
    borrowKink,
    borrowPerSecondInterestRateBase.times(SECONDS_PER_YEAR),
    borrowPerSecondInterestRateSlopeLow.times(SECONDS_PER_YEAR),
    borrowPerSecondInterestRateSlopeHigh.times(SECONDS_PER_YEAR),
    createdAt
  );
}
