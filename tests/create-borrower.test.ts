import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import {
  clearStore,
  test,
  assert,
  describe,
  beforeAll,
  afterAll,
} from 'matchstick-as/assembly/index';
import { createBorrower } from '../src/helpers/create-borrower';

function createBorrowerId(
  proxyCometAddress: Address,
  userAddress: Address,
): Bytes {
  return Bytes.fromHexString(
    proxyCometAddress.toHexString() + userAddress.toHexString(),
  );
}

describe('createBorrower tests', () => {
  beforeAll(() => {
    let proxyCometAddress = Address.fromString(
      '0x0000000000000000000000000000000000000001',
    );
    let userAddress = Address.fromString(
      '0x0000000000000000000000000000000000000002',
    );
    let createdAt = BigInt.fromI32(1633024800);

    createBorrower(proxyCometAddress, userAddress, createdAt);
  });

  afterAll(() => {
    clearStore();
  });

  test('Borrower entity created and stored', () => {
    let borrowerId = createBorrowerId(
      Address.fromString('0x0000000000000000000000000000000000000001'),
      Address.fromString('0x0000000000000000000000000000000000000002'),
    ).toHexString();

    assert.entityCount('Borrower', 1);

    assert.fieldEquals(
      'Borrower',
      borrowerId,
      'userAddress',
      '0x0000000000000000000000000000000000000002',
    );
    assert.fieldEquals(
      'Borrower',
      borrowerId,
      'proxyCometAddress',
      '0x0000000000000000000000000000000000000001',
    );
    assert.fieldEquals('Borrower', borrowerId, 'createdAt', '1633024800');
  });
});
