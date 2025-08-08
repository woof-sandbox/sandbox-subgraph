import { ethereum, log } from '@graphprotocol/graph-ts';
import { CONTRACT_NAMES } from '../../generated/contract-names';
import { EVENT_NAMES } from '../../generated/event-names';
import { LogEventOptions } from './log-event-options';

function getEventName(event: ethereum.Event, eventName: string): string {
  let finEventName = 'UnknownEvent';
  if (eventName !== '') {
    finEventName = eventName;
  } else if (event.receipt !== null) {
    const logs = event.receipt!.logs; // Required with AssemblyScript

    for (let i = 0; i < logs.length; i++) {
      const logEntry = logs[i];

      if (
        logEntry.logIndex.equals(event.logIndex) &&
        logEntry.address.toHexString() == event.address.toHexString()
      ) {
        const topic0 = logEntry.topics[0].toHexString().toLowerCase();

        const foundName = EVENT_NAMES.get(topic0);
        if (foundName) finEventName = foundName;

        break;
      }
    }
  }
  return finEventName;
}

function getContractName(event: ethereum.Event, contractName: string): string {
  const address = event.address.toHexString();
  let finContractName = 'UnknownContract';

  if (contractName !== '') {
    finContractName = contractName;
  } else {
    const foundName = CONTRACT_NAMES.get(event.address.toHexString());
    if (foundName) finContractName = foundName;
  }
  return `${finContractName}:${address}`;
}

export function logEvent(event: ethereum.Event): void {
  // !: make sure you are using "receipt: true" if you not specify eventName manually
  logEventManual(event, null);
}

export function logEventManual(
  event: ethereum.Event,
  options: LogEventOptions | null
): void {
  let placeholders = '';
  let params = new Array<string>();

  if (!options) options = new LogEventOptions();

  const contractInfo = getContractName(event, options.contractName);
  const eventInfo = getEventName(event, options.eventName);

  const parameters = event.parameters;
  for (let i = 0; i < parameters.length; i++) {
    let param = parameters[i];
    let value = param.value;

    // Convert types to strings
    if (value.kind == ethereum.ValueKind.ADDRESS) {
      params.push(value.toAddress().toHexString());
    } else if (
      value.kind == ethereum.ValueKind.UINT ||
      value.kind == ethereum.ValueKind.INT
    ) {
      params.push(value.toBigInt().toString());
    } else if (value.kind == ethereum.ValueKind.STRING) {
      params.push(value.toString());
    } else if (value.kind == ethereum.ValueKind.BYTES) {
      params.push(value.toBytes().toHexString());
    } else if (value.kind == ethereum.ValueKind.BOOL) {
      params.push(value.toBoolean() ? 'true' : 'false');
    } else {
      params.push('UnknownType');
    }
    placeholders += '{}, ';
  }
  placeholders = placeholders.slice(0, -2);

  log.info(
    `${event.block.number}/${event.block.timestamp} CAUGHT ${contractInfo} ${eventInfo} (${event.transaction.hash.toHexString()}) | [${placeholders}]`,
    params
  );
}
