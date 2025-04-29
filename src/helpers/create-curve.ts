import { BigInt } from '@graphprotocol/graph-ts';
import { BaseAssetCurve } from '../../generated/schema';

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
