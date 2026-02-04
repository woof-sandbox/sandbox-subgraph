import fs from 'fs';
import path from 'path';

function getArgValue(flagLong, flagShort) {
  const args = process.argv.slice(2);

  const longIdx = args.indexOf(flagLong);
  if (longIdx !== -1 && args[longIdx + 1]) return args[longIdx + 1];

  if (flagShort) {
    const shortIdx = args.indexOf(flagShort);
    if (shortIdx !== -1 && args[shortIdx + 1]) return args[shortIdx + 1];
  }

  return null;
}

const network = process.env.NETWORK;

if (!network) {
  throw new Error('Please set NETWORK env variable (e.g., NETWORK=mainnet)');
}

const networksFile =
  process.env.NETWORKS_FILE ||
  getArgValue('--networks-file', '-f') ||
  './networks.json';

const networksPath = path.isAbsolute(networksFile)
  ? networksFile
  : path.resolve(process.cwd(), networksFile);

if (!fs.existsSync(networksPath)) {
  throw new Error(`Networks file not found: ${networksPath}`);
}

const networksJson = JSON.parse(fs.readFileSync(networksPath, 'utf8'));
const contractsOrArray = networksJson[network];

if (!contractsOrArray) {
  throw new Error(
    `Network '${network}' not found in ${path.basename(networksPath)}`
  );
}

const addressToName = new Map();

function putContract(contractName, contractInfo) {
  const address = contractInfo?.address;
  if (typeof address !== 'string' || !address) {
    throw new Error(
      `Missing/invalid address for contract '${contractName}' in network '${network}'`
    );
  }

  const normalized = address.toLowerCase();
  if (!/^0x[0-9a-f]{40}$/.test(normalized)) {
    throw new Error(
      `Invalid address '${address}' for contract '${contractName}' in network '${network}'`
    );
  }

  addressToName.set(normalized, contractName);
}

if (Array.isArray(contractsOrArray)) {
  for (const obj of contractsOrArray) {
    for (const [contractName, contractInfo] of Object.entries(obj)) {
      putContract(contractName, contractInfo);
    }
  }
} else {
  for (const [contractName, contractInfo] of Object.entries(contractsOrArray)) {
    putContract(contractName, contractInfo);
  }
}

let output = `// Auto-generated file. Do not edit manually.\n`;
output += `import { TypedMap } from "@graphprotocol/graph-ts";\n\n`;
output += `export let CONTRACT_NAMES = new TypedMap<string, string>();\n\n`;

for (const [address, name] of addressToName.entries()) {
  output += `CONTRACT_NAMES.set("${address}", "${name}");\n`;
}

const outPath = path.resolve(process.cwd(), 'generated/contract-names.ts');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output);

console.log(`✅ Generated contract-names.ts for network: ${network}`);
console.log(`ℹ️ Networks file: ${networksPath}`);
