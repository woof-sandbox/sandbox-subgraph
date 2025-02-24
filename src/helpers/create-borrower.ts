import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Borrower } from '../../generated/schema';

function createBorrowerId(
  proxyCometAddress: Address,
  userAddress: Address,
): Bytes {
  return Bytes.fromHexString(
    proxyCometAddress.toHexString() + userAddress.toHexString(),
  );
}

export function createBorrower(
  proxyCometAddress: Address,
  userAddress: Address,
  createdAt: BigInt,
): void {
  let borrower = Borrower.load(
    createBorrowerId(proxyCometAddress, userAddress),
  );
  if (!borrower) {
    borrower = new Borrower(createBorrowerId(proxyCometAddress, userAddress));
    borrower.userAddress = userAddress;
    borrower.proxyCometAddress = proxyCometAddress;
    borrower.createdAt = createdAt;

    borrower.save();
  }
}
