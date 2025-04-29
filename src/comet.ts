import {
  AbsorbDebt,
  Supply,
  Transfer,
  Withdraw,
} from '../generated/templates/Comet/Comet';
import { logEvent } from './utils/log-event';
import { createUser } from './helpers/create-user';
import { updateUserPrincipal } from './helpers/update-user-principal';

// START: USER

export function handleWithdraw(event: Withdraw): void {
  logEvent(event);
  createUser(event.address, event.params.to, event.block.timestamp);
  updateUserPrincipal(event.address, event.params.to, event.block.timestamp);
}

export function handleSupply(event: Supply): void {
  logEvent(event);
  createUser(event.address, event.params.dst, event.block.timestamp);
  updateUserPrincipal(event.address, event.params.dst, event.block.timestamp);
}

export function handleTransfer(event: Transfer): void {
  logEvent(event);
  createUser(event.address, event.params.to, event.block.timestamp);
  updateUserPrincipal(event.address, event.params.from, event.block.timestamp);
}

export function handleAbsorbDebt(event: AbsorbDebt): void {
  logEvent(event);
  createUser(event.address, event.params.borrower, event.block.timestamp);
  updateUserPrincipal(event.address, event.params.borrower, event.block.timestamp);
}

// END: USER

// -=-=-=-=-=-=-=-=-=-=-=-=- Paperclip Start -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// -=-=-=-=-=-=-=-=-=-=-=-=- Paperclip End -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
