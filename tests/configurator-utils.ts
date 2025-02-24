import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AddAsset,
  CometDeployed,
  GovernorTransferred,
  SetBaseBorrowMin,
  SetBaseMinForRewards,
  SetBaseTokenPriceFeed,
  SetBaseTrackingBorrowSpeed,
  SetBaseTrackingSupplySpeed,
  SetBorrowKink,
  SetBorrowPerYearInterestRateBase,
  SetBorrowPerYearInterestRateSlopeHigh,
  SetBorrowPerYearInterestRateSlopeLow,
  SetConfiguration,
  SetExtensionDelegate,
  SetFactory,
  SetGovernor,
  SetPauseGuardian,
  SetStoreFrontPriceFactor,
  SetSupplyKink,
  SetSupplyPerYearInterestRateBase,
  SetSupplyPerYearInterestRateSlopeHigh,
  SetSupplyPerYearInterestRateSlopeLow,
  SetTargetReserves,
  UpdateAsset,
  UpdateAssetBorrowCollateralFactor,
  UpdateAssetLiquidateCollateralFactor,
  UpdateAssetLiquidationFactor,
  UpdateAssetPriceFeed,
  UpdateAssetSupplyCap
} from "../generated/Configurator/Configurator"

export function createAddAssetEvent(
  cometProxy: Address,
  assetConfig: ethereum.Tuple
): AddAsset {
  let addAssetEvent = changetype<AddAsset>(newMockEvent())

  addAssetEvent.parameters = new Array()

  addAssetEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  addAssetEvent.parameters.push(
    new ethereum.EventParam(
      "assetConfig",
      ethereum.Value.fromTuple(assetConfig)
    )
  )

  return addAssetEvent
}

export function createCometDeployedEvent(
  cometProxy: Address,
  newComet: Address
): CometDeployed {
  let cometDeployedEvent = changetype<CometDeployed>(newMockEvent())

  cometDeployedEvent.parameters = new Array()

  cometDeployedEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  cometDeployedEvent.parameters.push(
    new ethereum.EventParam("newComet", ethereum.Value.fromAddress(newComet))
  )

  return cometDeployedEvent
}

export function createGovernorTransferredEvent(
  oldGovernor: Address,
  newGovernor: Address
): GovernorTransferred {
  let governorTransferredEvent = changetype<GovernorTransferred>(newMockEvent())

  governorTransferredEvent.parameters = new Array()

  governorTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "oldGovernor",
      ethereum.Value.fromAddress(oldGovernor)
    )
  )
  governorTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "newGovernor",
      ethereum.Value.fromAddress(newGovernor)
    )
  )

  return governorTransferredEvent
}

export function createSetBaseBorrowMinEvent(
  cometProxy: Address,
  oldBaseBorrowMin: BigInt,
  newBaseBorrowMin: BigInt
): SetBaseBorrowMin {
  let setBaseBorrowMinEvent = changetype<SetBaseBorrowMin>(newMockEvent())

  setBaseBorrowMinEvent.parameters = new Array()

  setBaseBorrowMinEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setBaseBorrowMinEvent.parameters.push(
    new ethereum.EventParam(
      "oldBaseBorrowMin",
      ethereum.Value.fromUnsignedBigInt(oldBaseBorrowMin)
    )
  )
  setBaseBorrowMinEvent.parameters.push(
    new ethereum.EventParam(
      "newBaseBorrowMin",
      ethereum.Value.fromUnsignedBigInt(newBaseBorrowMin)
    )
  )

  return setBaseBorrowMinEvent
}

export function createSetBaseMinForRewardsEvent(
  cometProxy: Address,
  oldBaseMinForRewards: BigInt,
  newBaseMinForRewards: BigInt
): SetBaseMinForRewards {
  let setBaseMinForRewardsEvent =
    changetype<SetBaseMinForRewards>(newMockEvent())

  setBaseMinForRewardsEvent.parameters = new Array()

  setBaseMinForRewardsEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setBaseMinForRewardsEvent.parameters.push(
    new ethereum.EventParam(
      "oldBaseMinForRewards",
      ethereum.Value.fromUnsignedBigInt(oldBaseMinForRewards)
    )
  )
  setBaseMinForRewardsEvent.parameters.push(
    new ethereum.EventParam(
      "newBaseMinForRewards",
      ethereum.Value.fromUnsignedBigInt(newBaseMinForRewards)
    )
  )

  return setBaseMinForRewardsEvent
}

export function createSetBaseTokenPriceFeedEvent(
  cometProxy: Address,
  oldBaseTokenPriceFeed: Address,
  newBaseTokenPriceFeed: Address
): SetBaseTokenPriceFeed {
  let setBaseTokenPriceFeedEvent =
    changetype<SetBaseTokenPriceFeed>(newMockEvent())

  setBaseTokenPriceFeedEvent.parameters = new Array()

  setBaseTokenPriceFeedEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setBaseTokenPriceFeedEvent.parameters.push(
    new ethereum.EventParam(
      "oldBaseTokenPriceFeed",
      ethereum.Value.fromAddress(oldBaseTokenPriceFeed)
    )
  )
  setBaseTokenPriceFeedEvent.parameters.push(
    new ethereum.EventParam(
      "newBaseTokenPriceFeed",
      ethereum.Value.fromAddress(newBaseTokenPriceFeed)
    )
  )

  return setBaseTokenPriceFeedEvent
}

export function createSetBaseTrackingBorrowSpeedEvent(
  cometProxy: Address,
  oldBaseTrackingBorrowSpeed: BigInt,
  newBaseTrackingBorrowSpeed: BigInt
): SetBaseTrackingBorrowSpeed {
  let setBaseTrackingBorrowSpeedEvent =
    changetype<SetBaseTrackingBorrowSpeed>(newMockEvent())

  setBaseTrackingBorrowSpeedEvent.parameters = new Array()

  setBaseTrackingBorrowSpeedEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setBaseTrackingBorrowSpeedEvent.parameters.push(
    new ethereum.EventParam(
      "oldBaseTrackingBorrowSpeed",
      ethereum.Value.fromUnsignedBigInt(oldBaseTrackingBorrowSpeed)
    )
  )
  setBaseTrackingBorrowSpeedEvent.parameters.push(
    new ethereum.EventParam(
      "newBaseTrackingBorrowSpeed",
      ethereum.Value.fromUnsignedBigInt(newBaseTrackingBorrowSpeed)
    )
  )

  return setBaseTrackingBorrowSpeedEvent
}

export function createSetBaseTrackingSupplySpeedEvent(
  cometProxy: Address,
  oldBaseTrackingSupplySpeed: BigInt,
  newBaseTrackingSupplySpeed: BigInt
): SetBaseTrackingSupplySpeed {
  let setBaseTrackingSupplySpeedEvent =
    changetype<SetBaseTrackingSupplySpeed>(newMockEvent())

  setBaseTrackingSupplySpeedEvent.parameters = new Array()

  setBaseTrackingSupplySpeedEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setBaseTrackingSupplySpeedEvent.parameters.push(
    new ethereum.EventParam(
      "oldBaseTrackingSupplySpeed",
      ethereum.Value.fromUnsignedBigInt(oldBaseTrackingSupplySpeed)
    )
  )
  setBaseTrackingSupplySpeedEvent.parameters.push(
    new ethereum.EventParam(
      "newBaseTrackingSupplySpeed",
      ethereum.Value.fromUnsignedBigInt(newBaseTrackingSupplySpeed)
    )
  )

  return setBaseTrackingSupplySpeedEvent
}

export function createSetBorrowKinkEvent(
  cometProxy: Address,
  oldKink: BigInt,
  newKink: BigInt
): SetBorrowKink {
  let setBorrowKinkEvent = changetype<SetBorrowKink>(newMockEvent())

  setBorrowKinkEvent.parameters = new Array()

  setBorrowKinkEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setBorrowKinkEvent.parameters.push(
    new ethereum.EventParam(
      "oldKink",
      ethereum.Value.fromUnsignedBigInt(oldKink)
    )
  )
  setBorrowKinkEvent.parameters.push(
    new ethereum.EventParam(
      "newKink",
      ethereum.Value.fromUnsignedBigInt(newKink)
    )
  )

  return setBorrowKinkEvent
}

export function createSetBorrowPerYearInterestRateBaseEvent(
  cometProxy: Address,
  oldIRBase: BigInt,
  newIRBase: BigInt
): SetBorrowPerYearInterestRateBase {
  let setBorrowPerYearInterestRateBaseEvent =
    changetype<SetBorrowPerYearInterestRateBase>(newMockEvent())

  setBorrowPerYearInterestRateBaseEvent.parameters = new Array()

  setBorrowPerYearInterestRateBaseEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setBorrowPerYearInterestRateBaseEvent.parameters.push(
    new ethereum.EventParam(
      "oldIRBase",
      ethereum.Value.fromUnsignedBigInt(oldIRBase)
    )
  )
  setBorrowPerYearInterestRateBaseEvent.parameters.push(
    new ethereum.EventParam(
      "newIRBase",
      ethereum.Value.fromUnsignedBigInt(newIRBase)
    )
  )

  return setBorrowPerYearInterestRateBaseEvent
}

export function createSetBorrowPerYearInterestRateSlopeHighEvent(
  cometProxy: Address,
  oldIRSlopeHigh: BigInt,
  newIRSlopeHigh: BigInt
): SetBorrowPerYearInterestRateSlopeHigh {
  let setBorrowPerYearInterestRateSlopeHighEvent =
    changetype<SetBorrowPerYearInterestRateSlopeHigh>(newMockEvent())

  setBorrowPerYearInterestRateSlopeHighEvent.parameters = new Array()

  setBorrowPerYearInterestRateSlopeHighEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setBorrowPerYearInterestRateSlopeHighEvent.parameters.push(
    new ethereum.EventParam(
      "oldIRSlopeHigh",
      ethereum.Value.fromUnsignedBigInt(oldIRSlopeHigh)
    )
  )
  setBorrowPerYearInterestRateSlopeHighEvent.parameters.push(
    new ethereum.EventParam(
      "newIRSlopeHigh",
      ethereum.Value.fromUnsignedBigInt(newIRSlopeHigh)
    )
  )

  return setBorrowPerYearInterestRateSlopeHighEvent
}

export function createSetBorrowPerYearInterestRateSlopeLowEvent(
  cometProxy: Address,
  oldIRSlopeLow: BigInt,
  newIRSlopeLow: BigInt
): SetBorrowPerYearInterestRateSlopeLow {
  let setBorrowPerYearInterestRateSlopeLowEvent =
    changetype<SetBorrowPerYearInterestRateSlopeLow>(newMockEvent())

  setBorrowPerYearInterestRateSlopeLowEvent.parameters = new Array()

  setBorrowPerYearInterestRateSlopeLowEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setBorrowPerYearInterestRateSlopeLowEvent.parameters.push(
    new ethereum.EventParam(
      "oldIRSlopeLow",
      ethereum.Value.fromUnsignedBigInt(oldIRSlopeLow)
    )
  )
  setBorrowPerYearInterestRateSlopeLowEvent.parameters.push(
    new ethereum.EventParam(
      "newIRSlopeLow",
      ethereum.Value.fromUnsignedBigInt(newIRSlopeLow)
    )
  )

  return setBorrowPerYearInterestRateSlopeLowEvent
}

export function createSetConfigurationEvent(
  cometProxy: Address,
  oldConfiguration: ethereum.Tuple,
  newConfiguration: ethereum.Tuple
): SetConfiguration {
  let setConfigurationEvent = changetype<SetConfiguration>(newMockEvent())

  setConfigurationEvent.parameters = new Array()

  setConfigurationEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setConfigurationEvent.parameters.push(
    new ethereum.EventParam(
      "oldConfiguration",
      ethereum.Value.fromTuple(oldConfiguration)
    )
  )
  setConfigurationEvent.parameters.push(
    new ethereum.EventParam(
      "newConfiguration",
      ethereum.Value.fromTuple(newConfiguration)
    )
  )

  return setConfigurationEvent
}

export function createSetExtensionDelegateEvent(
  cometProxy: Address,
  oldExt: Address,
  newExt: Address
): SetExtensionDelegate {
  let setExtensionDelegateEvent =
    changetype<SetExtensionDelegate>(newMockEvent())

  setExtensionDelegateEvent.parameters = new Array()

  setExtensionDelegateEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setExtensionDelegateEvent.parameters.push(
    new ethereum.EventParam("oldExt", ethereum.Value.fromAddress(oldExt))
  )
  setExtensionDelegateEvent.parameters.push(
    new ethereum.EventParam("newExt", ethereum.Value.fromAddress(newExt))
  )

  return setExtensionDelegateEvent
}

export function createSetFactoryEvent(
  cometProxy: Address,
  oldFactory: Address,
  newFactory: Address
): SetFactory {
  let setFactoryEvent = changetype<SetFactory>(newMockEvent())

  setFactoryEvent.parameters = new Array()

  setFactoryEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setFactoryEvent.parameters.push(
    new ethereum.EventParam(
      "oldFactory",
      ethereum.Value.fromAddress(oldFactory)
    )
  )
  setFactoryEvent.parameters.push(
    new ethereum.EventParam(
      "newFactory",
      ethereum.Value.fromAddress(newFactory)
    )
  )

  return setFactoryEvent
}

export function createSetGovernorEvent(
  cometProxy: Address,
  oldGovernor: Address,
  newGovernor: Address
): SetGovernor {
  let setGovernorEvent = changetype<SetGovernor>(newMockEvent())

  setGovernorEvent.parameters = new Array()

  setGovernorEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setGovernorEvent.parameters.push(
    new ethereum.EventParam(
      "oldGovernor",
      ethereum.Value.fromAddress(oldGovernor)
    )
  )
  setGovernorEvent.parameters.push(
    new ethereum.EventParam(
      "newGovernor",
      ethereum.Value.fromAddress(newGovernor)
    )
  )

  return setGovernorEvent
}

export function createSetPauseGuardianEvent(
  cometProxy: Address,
  oldPauseGuardian: Address,
  newPauseGuardian: Address
): SetPauseGuardian {
  let setPauseGuardianEvent = changetype<SetPauseGuardian>(newMockEvent())

  setPauseGuardianEvent.parameters = new Array()

  setPauseGuardianEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setPauseGuardianEvent.parameters.push(
    new ethereum.EventParam(
      "oldPauseGuardian",
      ethereum.Value.fromAddress(oldPauseGuardian)
    )
  )
  setPauseGuardianEvent.parameters.push(
    new ethereum.EventParam(
      "newPauseGuardian",
      ethereum.Value.fromAddress(newPauseGuardian)
    )
  )

  return setPauseGuardianEvent
}

export function createSetStoreFrontPriceFactorEvent(
  cometProxy: Address,
  oldStoreFrontPriceFactor: BigInt,
  newStoreFrontPriceFactor: BigInt
): SetStoreFrontPriceFactor {
  let setStoreFrontPriceFactorEvent =
    changetype<SetStoreFrontPriceFactor>(newMockEvent())

  setStoreFrontPriceFactorEvent.parameters = new Array()

  setStoreFrontPriceFactorEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setStoreFrontPriceFactorEvent.parameters.push(
    new ethereum.EventParam(
      "oldStoreFrontPriceFactor",
      ethereum.Value.fromUnsignedBigInt(oldStoreFrontPriceFactor)
    )
  )
  setStoreFrontPriceFactorEvent.parameters.push(
    new ethereum.EventParam(
      "newStoreFrontPriceFactor",
      ethereum.Value.fromUnsignedBigInt(newStoreFrontPriceFactor)
    )
  )

  return setStoreFrontPriceFactorEvent
}

export function createSetSupplyKinkEvent(
  cometProxy: Address,
  oldKink: BigInt,
  newKink: BigInt
): SetSupplyKink {
  let setSupplyKinkEvent = changetype<SetSupplyKink>(newMockEvent())

  setSupplyKinkEvent.parameters = new Array()

  setSupplyKinkEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setSupplyKinkEvent.parameters.push(
    new ethereum.EventParam(
      "oldKink",
      ethereum.Value.fromUnsignedBigInt(oldKink)
    )
  )
  setSupplyKinkEvent.parameters.push(
    new ethereum.EventParam(
      "newKink",
      ethereum.Value.fromUnsignedBigInt(newKink)
    )
  )

  return setSupplyKinkEvent
}

export function createSetSupplyPerYearInterestRateBaseEvent(
  cometProxy: Address,
  oldIRBase: BigInt,
  newIRBase: BigInt
): SetSupplyPerYearInterestRateBase {
  let setSupplyPerYearInterestRateBaseEvent =
    changetype<SetSupplyPerYearInterestRateBase>(newMockEvent())

  setSupplyPerYearInterestRateBaseEvent.parameters = new Array()

  setSupplyPerYearInterestRateBaseEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setSupplyPerYearInterestRateBaseEvent.parameters.push(
    new ethereum.EventParam(
      "oldIRBase",
      ethereum.Value.fromUnsignedBigInt(oldIRBase)
    )
  )
  setSupplyPerYearInterestRateBaseEvent.parameters.push(
    new ethereum.EventParam(
      "newIRBase",
      ethereum.Value.fromUnsignedBigInt(newIRBase)
    )
  )

  return setSupplyPerYearInterestRateBaseEvent
}

export function createSetSupplyPerYearInterestRateSlopeHighEvent(
  cometProxy: Address,
  oldIRSlopeHigh: BigInt,
  newIRSlopeHigh: BigInt
): SetSupplyPerYearInterestRateSlopeHigh {
  let setSupplyPerYearInterestRateSlopeHighEvent =
    changetype<SetSupplyPerYearInterestRateSlopeHigh>(newMockEvent())

  setSupplyPerYearInterestRateSlopeHighEvent.parameters = new Array()

  setSupplyPerYearInterestRateSlopeHighEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setSupplyPerYearInterestRateSlopeHighEvent.parameters.push(
    new ethereum.EventParam(
      "oldIRSlopeHigh",
      ethereum.Value.fromUnsignedBigInt(oldIRSlopeHigh)
    )
  )
  setSupplyPerYearInterestRateSlopeHighEvent.parameters.push(
    new ethereum.EventParam(
      "newIRSlopeHigh",
      ethereum.Value.fromUnsignedBigInt(newIRSlopeHigh)
    )
  )

  return setSupplyPerYearInterestRateSlopeHighEvent
}

export function createSetSupplyPerYearInterestRateSlopeLowEvent(
  cometProxy: Address,
  oldIRSlopeLow: BigInt,
  newIRSlopeLow: BigInt
): SetSupplyPerYearInterestRateSlopeLow {
  let setSupplyPerYearInterestRateSlopeLowEvent =
    changetype<SetSupplyPerYearInterestRateSlopeLow>(newMockEvent())

  setSupplyPerYearInterestRateSlopeLowEvent.parameters = new Array()

  setSupplyPerYearInterestRateSlopeLowEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setSupplyPerYearInterestRateSlopeLowEvent.parameters.push(
    new ethereum.EventParam(
      "oldIRSlopeLow",
      ethereum.Value.fromUnsignedBigInt(oldIRSlopeLow)
    )
  )
  setSupplyPerYearInterestRateSlopeLowEvent.parameters.push(
    new ethereum.EventParam(
      "newIRSlopeLow",
      ethereum.Value.fromUnsignedBigInt(newIRSlopeLow)
    )
  )

  return setSupplyPerYearInterestRateSlopeLowEvent
}

export function createSetTargetReservesEvent(
  cometProxy: Address,
  oldTargetReserves: BigInt,
  newTargetReserves: BigInt
): SetTargetReserves {
  let setTargetReservesEvent = changetype<SetTargetReserves>(newMockEvent())

  setTargetReservesEvent.parameters = new Array()

  setTargetReservesEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  setTargetReservesEvent.parameters.push(
    new ethereum.EventParam(
      "oldTargetReserves",
      ethereum.Value.fromUnsignedBigInt(oldTargetReserves)
    )
  )
  setTargetReservesEvent.parameters.push(
    new ethereum.EventParam(
      "newTargetReserves",
      ethereum.Value.fromUnsignedBigInt(newTargetReserves)
    )
  )

  return setTargetReservesEvent
}

export function createUpdateAssetEvent(
  cometProxy: Address,
  oldAssetConfig: ethereum.Tuple,
  newAssetConfig: ethereum.Tuple
): UpdateAsset {
  let updateAssetEvent = changetype<UpdateAsset>(newMockEvent())

  updateAssetEvent.parameters = new Array()

  updateAssetEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  updateAssetEvent.parameters.push(
    new ethereum.EventParam(
      "oldAssetConfig",
      ethereum.Value.fromTuple(oldAssetConfig)
    )
  )
  updateAssetEvent.parameters.push(
    new ethereum.EventParam(
      "newAssetConfig",
      ethereum.Value.fromTuple(newAssetConfig)
    )
  )

  return updateAssetEvent
}

export function createUpdateAssetBorrowCollateralFactorEvent(
  cometProxy: Address,
  asset: Address,
  oldBorrowCF: BigInt,
  newBorrowCF: BigInt
): UpdateAssetBorrowCollateralFactor {
  let updateAssetBorrowCollateralFactorEvent =
    changetype<UpdateAssetBorrowCollateralFactor>(newMockEvent())

  updateAssetBorrowCollateralFactorEvent.parameters = new Array()

  updateAssetBorrowCollateralFactorEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  updateAssetBorrowCollateralFactorEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  updateAssetBorrowCollateralFactorEvent.parameters.push(
    new ethereum.EventParam(
      "oldBorrowCF",
      ethereum.Value.fromUnsignedBigInt(oldBorrowCF)
    )
  )
  updateAssetBorrowCollateralFactorEvent.parameters.push(
    new ethereum.EventParam(
      "newBorrowCF",
      ethereum.Value.fromUnsignedBigInt(newBorrowCF)
    )
  )

  return updateAssetBorrowCollateralFactorEvent
}

export function createUpdateAssetLiquidateCollateralFactorEvent(
  cometProxy: Address,
  asset: Address,
  oldLiquidateCF: BigInt,
  newLiquidateCF: BigInt
): UpdateAssetLiquidateCollateralFactor {
  let updateAssetLiquidateCollateralFactorEvent =
    changetype<UpdateAssetLiquidateCollateralFactor>(newMockEvent())

  updateAssetLiquidateCollateralFactorEvent.parameters = new Array()

  updateAssetLiquidateCollateralFactorEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  updateAssetLiquidateCollateralFactorEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  updateAssetLiquidateCollateralFactorEvent.parameters.push(
    new ethereum.EventParam(
      "oldLiquidateCF",
      ethereum.Value.fromUnsignedBigInt(oldLiquidateCF)
    )
  )
  updateAssetLiquidateCollateralFactorEvent.parameters.push(
    new ethereum.EventParam(
      "newLiquidateCF",
      ethereum.Value.fromUnsignedBigInt(newLiquidateCF)
    )
  )

  return updateAssetLiquidateCollateralFactorEvent
}

export function createUpdateAssetLiquidationFactorEvent(
  cometProxy: Address,
  asset: Address,
  oldLiquidationFactor: BigInt,
  newLiquidationFactor: BigInt
): UpdateAssetLiquidationFactor {
  let updateAssetLiquidationFactorEvent =
    changetype<UpdateAssetLiquidationFactor>(newMockEvent())

  updateAssetLiquidationFactorEvent.parameters = new Array()

  updateAssetLiquidationFactorEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  updateAssetLiquidationFactorEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  updateAssetLiquidationFactorEvent.parameters.push(
    new ethereum.EventParam(
      "oldLiquidationFactor",
      ethereum.Value.fromUnsignedBigInt(oldLiquidationFactor)
    )
  )
  updateAssetLiquidationFactorEvent.parameters.push(
    new ethereum.EventParam(
      "newLiquidationFactor",
      ethereum.Value.fromUnsignedBigInt(newLiquidationFactor)
    )
  )

  return updateAssetLiquidationFactorEvent
}

export function createUpdateAssetPriceFeedEvent(
  cometProxy: Address,
  asset: Address,
  oldPriceFeed: Address,
  newPriceFeed: Address
): UpdateAssetPriceFeed {
  let updateAssetPriceFeedEvent =
    changetype<UpdateAssetPriceFeed>(newMockEvent())

  updateAssetPriceFeedEvent.parameters = new Array()

  updateAssetPriceFeedEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  updateAssetPriceFeedEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  updateAssetPriceFeedEvent.parameters.push(
    new ethereum.EventParam(
      "oldPriceFeed",
      ethereum.Value.fromAddress(oldPriceFeed)
    )
  )
  updateAssetPriceFeedEvent.parameters.push(
    new ethereum.EventParam(
      "newPriceFeed",
      ethereum.Value.fromAddress(newPriceFeed)
    )
  )

  return updateAssetPriceFeedEvent
}

export function createUpdateAssetSupplyCapEvent(
  cometProxy: Address,
  asset: Address,
  oldSupplyCap: BigInt,
  newSupplyCap: BigInt
): UpdateAssetSupplyCap {
  let updateAssetSupplyCapEvent =
    changetype<UpdateAssetSupplyCap>(newMockEvent())

  updateAssetSupplyCapEvent.parameters = new Array()

  updateAssetSupplyCapEvent.parameters.push(
    new ethereum.EventParam(
      "cometProxy",
      ethereum.Value.fromAddress(cometProxy)
    )
  )
  updateAssetSupplyCapEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  )
  updateAssetSupplyCapEvent.parameters.push(
    new ethereum.EventParam(
      "oldSupplyCap",
      ethereum.Value.fromUnsignedBigInt(oldSupplyCap)
    )
  )
  updateAssetSupplyCapEvent.parameters.push(
    new ethereum.EventParam(
      "newSupplyCap",
      ethereum.Value.fromUnsignedBigInt(newSupplyCap)
    )
  )

  return updateAssetSupplyCapEvent
}
