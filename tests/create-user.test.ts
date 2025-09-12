import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import {
  assert,
  createMockedFunction,
  describe,
  test,
} from 'matchstick-as/assembly';
import { User } from '../generated/schema';
import { createUser } from '../src/helpers/create-user';
import { fetchUserPrincipal } from '../src/helpers/fetch-user-principal';
import { formUserId } from '../src/helpers/form-user-id';

function mockCometContract(
  cometAddress: Address,
  userAddress: Address,
  principal: BigInt,
  reverted: boolean
): void {
  createMockedFunction(
    cometAddress,
    'userBasic',
    'userBasic(address):(int104,uint64,uint64,uint16,uint8)'
  )
    .withArgs([ethereum.Value.fromAddress(userAddress)])
    .returns([
      ethereum.Value.fromSignedBigInt(reverted ? BigInt.zero() : principal), // int104
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0)), // uint64
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0)), // uint64
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0)), // uint16
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0)), // uint8
    ]);
}

describe('formUserId', () => {
  test('generates unique user ID', () => {
    let proxyAddress = Address.fromString(
      '0x0000000000000000000000000000000000000001'
    );
    let userAddress = Address.fromString(
      '0x0000000000000000000000000000000000000002'
    );

    let userId = formUserId(proxyAddress, userAddress);

    assert.stringEquals(
      userId.toHexString(),
      '0x0000000000000000000000000000000000000001000000000000000000000000000000000000000002'
    );
  });
});

describe('getUserPrincipal', () => {
  test('returns principal when not reverted', () => {
    let proxyAddress = Address.fromString(
      '0x0000000000000000000000000000000000000001'
    );
    let userAddress = Address.fromString(
      '0x0000000000000000000000000000000000000002'
    );
    let principal = BigInt.fromI32(1000);

    mockCometContract(proxyAddress, userAddress, principal, false);

    let result = fetchUserPrincipal(proxyAddress, userAddress);

    assert.bigIntEquals(result, principal);
  });

  test('returns 0 when reverted', () => {
    let proxyAddress = Address.fromString(
      '0x0000000000000000000000000000000000000001'
    );
    let userAddress = Address.fromString(
      '0x0000000000000000000000000000000000000002'
    );

    mockCometContract(proxyAddress, userAddress, BigInt.zero(), true);

    let result = fetchUserPrincipal(proxyAddress, userAddress);

    assert.bigIntEquals(result, BigInt.zero());
  });
});

describe('createUser', () => {
  test('creates user entity when it does not exist', () => {
    let proxyAddress = Address.fromString(
      '0x0000000000000000000000000000000000000001'
    );
    let userAddress = Address.fromString(
      '0x0000000000000000000000000000000000000002'
    );
    let createdAt = BigInt.fromI32(123456);

    createUser(proxyAddress, userAddress, createdAt);

    let user = User.load(formUserId(proxyAddress, userAddress));

    assert.assertNotNull(user);
    assert.bigIntEquals(
      user!.principal,
      fetchUserPrincipal(proxyAddress, userAddress)
    );
    assert.bytesEquals(user!.userAddress, userAddress);
    assert.bytesEquals(user!.cometAddress, proxyAddress);
    assert.bigIntEquals(user!.createdAt, createdAt);
  });

  test('does not overwrite existing user entity', () => {
    let proxyAddress = Address.fromString(
      '0x0000000000000000000000000000000000000001'
    );
    let userAddress = Address.fromString(
      '0x0000000000000000000000000000000000000002'
    );
    let createdAt = BigInt.fromI32(123456);

    let user = new User(formUserId(proxyAddress, userAddress));
    user.principal = BigInt.fromI32(500);
    user.userAddress = userAddress;
    user.cometAddress = proxyAddress;
    user.createdAt = createdAt;
    user.updatedAt = createdAt;
    user.save();

    createUser(proxyAddress, userAddress, BigInt.fromI32(999999));

    let loadedUser = User.load(formUserId(proxyAddress, userAddress));

    assert.bigIntEquals(loadedUser!.principal, BigInt.fromI32(500));
    assert.bigIntEquals(loadedUser!.createdAt, createdAt);
  });
});
