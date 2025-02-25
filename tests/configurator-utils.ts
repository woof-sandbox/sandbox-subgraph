import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { CometDeployed } from "../generated/Configurator/Configurator"

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
