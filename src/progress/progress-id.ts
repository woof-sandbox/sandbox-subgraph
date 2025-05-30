import { Address } from '@graphprotocol/graph-ts';

export namespace ProgressId {
  export function LastCuratorProposal(configController: Address): string {
    return `LastCuratorProposal:${configController.toHexString()}`;
  }
}
