import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AddAsset } from "../generated/schema"
import { AddAsset as AddAssetEvent } from "../generated/Configurator/Configurator"
import { handleAddAsset } from "../src/configurator"
import { createAddAssetEvent } from "./configurator-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let cometProxy = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let assetConfig = "ethereum.Tuple Not implemented"
    let newAddAssetEvent = createAddAssetEvent(cometProxy, assetConfig)
    handleAddAsset(newAddAssetEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AddAsset created and stored", () => {
    assert.entityCount("AddAsset", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AddAsset",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "cometProxy",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AddAsset",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "assetConfig",
      "ethereum.Tuple Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
