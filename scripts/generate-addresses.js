import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  throw new Error('❌ Please set NETWORK env variable (e.g., NETWORK=mainnet)');
}

const networksFile =
  process.env.NETWORKS_FILE ||
  getArgValue('--networks-file', '-f') ||
  'networks.json';

// Default behavior remains: resolve relative to repo root (../ from scripts dir)
const networksPath = path.isAbsolute(networksFile)
  ? networksFile
  : path.resolve(__dirname, '..', networksFile);

const outputPath = path.resolve(__dirname, '../generated/addresses.ts');

if (!fs.existsSync(networksPath)) {
  throw new Error(`❌ Networks file not found: ${networksPath}`);
}

const networksJson = JSON.parse(fs.readFileSync(networksPath, 'utf8'));
const contractsOrArray = networksJson[network];

if (!contractsOrArray) {
  throw new Error(
    `❌ Network '${network}' not found in ${path.basename(networksPath)}`
  );
}

const nameToAddress = new Map();

function putContract(contractName, contractInfo) {
  const address = contractInfo?.address;
  if (typeof address !== 'string' || !address) {
    throw new Error(
      `❌ Missing/invalid address for contract '${contractName}' in network '${network}'`
    );
  }
  nameToAddress.set(contractName, address.toLowerCase());
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

// CamelCase → UPPER_SNAKE_CASE
function toSnakeUpperCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-\s]/g, '_')
    .toUpperCase();
}

let output = `// Auto-generated file. Do not edit manually.\n`;
output += `import { Bytes } from "@graphprotocol/graph-ts";\n\n`;

for (const [name, address] of nameToAddress.entries()) {
  const constName = `${toSnakeUpperCase(name)}_ADDRESS`;
  output += `export const ${constName} = Bytes.fromHexString("${address}");\n`;
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output);

console.log(`✅ Generated addresses.ts for network: ${network}`);
console.log(`ℹ️ Networks file: ${networksPath}`);
