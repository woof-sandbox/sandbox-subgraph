import { Address, Bytes, log } from '@graphprotocol/graph-ts';
import { ConfigController } from '../../generated/schema';

export function getConfigController(address: Address): ConfigController | null {
  const addr = address.toHexString();
  const id = Bytes.fromHexString(addr);
  const controller = ConfigController.load(id);
  if (!controller) {
    log.warning('ConfigController not found: {}', [addr]);
  }
  return controller;
}
