import { Withdraw, Supply, Transfer, AbsorbDebt } from '../generated/templates/Comet/Comet';
import { createBorrower } from './helpers/create-borrower';
import { updateBorrowerPrincipal } from './helpers/update-borrower-principal';

export function handleWithdraw(event: Withdraw): void {
  createBorrower(event.address, event.params.to, event.block.timestamp);
  updateBorrowerPrincipal(event.address, event.params.to);
}

export function handleSupply(event: Supply): void {
  updateBorrowerPrincipal(event.address, event.params.dst);
}

export function handleTransfer(event: Transfer): void {
  updateBorrowerPrincipal(event.address, event.params.from);
  updateBorrowerPrincipal(event.address, event.params.to);

}

export function handleAbsorbDebt(event: AbsorbDebt): void {
  updateBorrowerPrincipal(event.address, event.params.borrower);
}