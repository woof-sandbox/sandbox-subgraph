import { Withdraw } from '../generated/templates/Comet/Comet';
import { createBorrower } from './helpers/create-borrower';

export function handleWithdraw(event: Withdraw): void {
  createBorrower(event.address, event.params.to, event.block.timestamp);
}
