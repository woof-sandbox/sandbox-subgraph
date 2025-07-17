import { Address, BigInt } from '@graphprotocol/graph-ts';
import { BaseAssetCurve } from '../../generated/schema';
import { formCurveId } from './form-curve-id';

export function createCurve(
  tokenAddress: Address,
  curveIndex: BigInt,
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
  const id = formCurveId(tokenAddress, curveIndex);

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
    curve.baseToken = tokenAddress;
    curve.curveIndex = curveIndex;
    //
    curve.createdAt = createdAt;
    curve.updatedAt = createdAt;
    curve.save();
  }

  return curve;
}
