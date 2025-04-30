import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { ConfigController } from '../../generated/schema';

export function createConfigController(
  address: Address,
  //
  owner: Address,
  guardian: Address,
  sandboxController: Address,
  marketFactory: Address,
  //
  curatorFee: BigInt,
  name: string,
  curatorProposalDuration: BigInt,
  proposalDuration: BigInt,
  //
  createdAt: BigInt
): ConfigController {
  const id = Bytes.fromHexString(address.toHexString());

  let configController = ConfigController.load(id);
  if (!configController) {
    configController = new ConfigController(id);
    //
    configController.owner = owner;
    configController.guardian = guardian;
    configController.sandboxController = sandboxController;
    configController.marketFactory = marketFactory;
    //
    configController.curatorFee = curatorFee;
    configController.name = name;
    configController.curatorProposalDuration = curatorProposalDuration;
    configController.proposalDuration = proposalDuration;
    //
    configController.createdAt = createdAt;
    configController.updatedAt = createdAt;
    configController.save();
  }

  return configController;
}
