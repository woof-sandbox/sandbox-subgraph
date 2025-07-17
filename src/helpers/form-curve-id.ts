import { Address, BigInt } from '@graphprotocol/graph-ts';

/**
 * @param baseToken
 * @param curveIndex - inner index of curve for base
 */
export function formCurveId(baseToken: Address, curveIndex: BigInt): string {
  return `${baseToken.toHexString()}:${curveIndex.toString()}`;
}
