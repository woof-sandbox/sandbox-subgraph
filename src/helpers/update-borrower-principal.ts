import { Address } from '@graphprotocol/graph-ts'
import { Borrower } from '../../generated/schema';
import { createBorrowerId } from './create-borrower';
import { Comet } from '../../generated/templates/Comet/Comet';

export function updateBorrowerPrincipal(proxyCometAddress: Address, userAddress: Address): void {
  let borrowerId = createBorrowerId(proxyCometAddress, userAddress);
  let borrower = Borrower.load(borrowerId);

  if (borrower) {
    let cometContract = Comet.bind(proxyCometAddress);
    let userBasic = cometContract.userBasic(userAddress);
    borrower.principal = userBasic.value0;
    borrower.save();
  }
}