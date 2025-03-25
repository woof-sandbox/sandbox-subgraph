import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Borrower } from '../../generated/schema';
import { Comet } from '../../generated/templates/Comet/Comet';

export function createBorrowerId(
  proxyCometAddress: Address,
  userAddress: Address,
): Bytes {
  return Bytes.fromHexString(
    proxyCometAddress.toHexString() + userAddress.toHexString(),
  );
}

function createBorrowerPrincipal(
  proxyCometAddress: Address,
  userAddress: Address,
): BigInt {
  let cometContract = Comet.bind(proxyCometAddress);
  let userBasic = cometContract.try_userBasic(userAddress);

  if (userBasic.reverted) {
    return BigInt.fromI32(0);
  }

  return userBasic.value.value0;
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
    borrower.principal = createBorrowerPrincipal(
      proxyCometAddress,
      userAddress,
    );
    borrower.userAddress = userAddress;
    borrower.proxyCometAddress = proxyCometAddress;
    borrower.createdAt = createdAt;

    borrower.save();
  }
}
