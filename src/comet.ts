import {
  AbsorbDebt as AbsorbDebtEvent,
  Supply as SupplyEvent,
  Transfer as TransferEvent,
  Withdraw as WithdrawEvent,
} from '../generated/templates/Comet/Comet';
import { logEvent } from './utils/log-event';
import { createUser } from './helpers/create-user';
import { updateUserPrincipal } from './helpers/update-user-principal';


export function handleSupply(event: SupplyEvent): void {
  logEvent(event);
  createUser(event.address, event.params.dst, event.block.timestamp);
  updateUserPrincipal(event.address, event.params.dst, event.block.timestamp);
}

export function handleWithdraw(event: WithdrawEvent): void {
  logEvent(event);
  createUser(event.address, event.params.to, event.block.timestamp);
  updateUserPrincipal(event.address, event.params.to, event.block.timestamp);
}

export function handleTransfer(event: TransferEvent): void {
  logEvent(event);
  createUser(event.address, event.params.to, event.block.timestamp);
  updateUserPrincipal(event.address, event.params.from, event.block.timestamp);
}

export function handleAbsorbDebt(event: AbsorbDebtEvent): void {
  logEvent(event);
  createUser(event.address, event.params.borrower, event.block.timestamp);
  updateUserPrincipal(
    event.address,
    event.params.borrower,
    event.block.timestamp
  );
}
