import { Withdraw, Supply, Transfer, AbsorbDebt } from '../generated/templates/Comet/Comet';
import { createUser } from './helpers/create-user';
import { updateUserPrincipal } from './helpers/update-user-principal';

export function handleWithdraw(event: Withdraw): void {
  createUser(event.address, event.params.to, event.block.timestamp);
  updateUserPrincipal(event.address, event.params.to);
}

export function handleSupply(event: Supply): void {
  createUser(event.address, event.params.dst, event.block.timestamp)
  updateUserPrincipal(event.address, event.params.dst);
}

export function handleTransfer(event: Transfer): void {
  createUser(event.address, event.params.to, event.block.timestamp);
  updateUserPrincipal(event.address, event.params.from);
  updateUserPrincipal(event.address, event.params.to);

}

export function handleAbsorbDebt(event: AbsorbDebt): void {
  createUser(event.address, event.params.borrower, event.block.timestamp);
  updateUserPrincipal(event.address, event.params.borrower);
}