import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { describe, test, assert, createMockedFunction } from 'matchstick-as/assembly/index';
import { updateUserPrincipal } from '../src/helpers/update-user-principal';
import { User } from '../generated/schema';

function mockCometContract(proxyCometAddress: Address, userAddress: Address, principal: BigInt): void {
  createMockedFunction(proxyCometAddress, 'userBasic', 'userBasic(address):(int104,uint64,uint64,uint16,uint8)')
    .withArgs([ethereum.Value.fromAddress(userAddress)])
    .returns([
      ethereum.Value.fromSignedBigInt(principal),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0)),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))
    ]);
}

describe('updateUserPrincipal', () => {
  test('updates user principal if user exists', () => {
    let proxyAddress = Address.fromString('0x0000000000000000000000000000000000000001');
    let userAddress = Address.fromString('0x0000000000000000000000000000000000000002');
    let userId = Bytes.fromHexString(proxyAddress.toHexString() + userAddress.toHexString());
    let initialPrincipal = BigInt.fromI32(500);
    let updatedPrincipal = BigInt.fromI32(1000);

    let user = new User(userId);
    user.principal = initialPrincipal;
    user.userAddress = userAddress;
    user.proxyCometAddress = proxyAddress;
    user.createdAt = BigInt.fromI32(123456); // Добавлен createdAt
    user.save();

    mockCometContract(proxyAddress, userAddress, updatedPrincipal);

    updateUserPrincipal(proxyAddress, userAddress);

    let updatedUser = User.load(userId);

    assert.assertNotNull(updatedUser);
    assert.bigIntEquals(updatedUser!.principal, updatedPrincipal);
  });
});