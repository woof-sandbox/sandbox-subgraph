import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { BaseConfiguration } from '../../generated/schema';

export function createBaseConfiguration(
  configControllerAddress: Address,
  //
  curveId: string,
  //
  createdAt: BigInt
): BaseConfiguration {
  const id = Bytes.fromHexString(configControllerAddress.toHexString()); // TODO: replace with the real id

  let configuration = BaseConfiguration.load(id);
  if (!configuration) {
    configuration = new BaseConfiguration(id);
    //
    configuration.comet = configControllerAddress;
    configuration.curve = curveId;
    //
    configuration.createdAt = createdAt;
    configuration.updatedAt = createdAt;
    configuration.save();
  }

  return configuration;
}
