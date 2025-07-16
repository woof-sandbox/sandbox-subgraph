import { Address, BigInt } from '@graphprotocol/graph-ts';
import { BaseAssetCurve } from '../../generated/schema';
import { formCurveId } from './form-curve-id';

export function updateCurve(
  tokenAddress: Address,
  curveIndex: number,
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
  updatedAt: BigInt
): BaseAssetCurve | null {
  const id = formCurveId(tokenAddress, curveIndex);

  let curve = BaseAssetCurve.load(id);
  if (curve) {
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
    curve.baseToken = tokenAddress;
    curve.curveIndex = Math.floor(curveIndex) as i32;
    //
    curve.updatedAt = updatedAt;
    curve.save();

    return curve;
  }

  return null;
}
