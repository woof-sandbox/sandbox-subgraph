import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const network = process.env.NETWORK;

if (!network) {
  throw new Error('❌ Please set NETWORK env variable (e.g., NETWORK=mainnet)');
}

const networksPath = path.resolve(__dirname, '../networks.json');
const outputPath = path.resolve(__dirname, '../generated/addresses.ts');

if (!fs.existsSync(networksPath)) {
  throw new Error('❌ networks.json not found');
}

const networksJson = JSON.parse(fs.readFileSync(networksPath, 'utf8'));
const contractsOrArray = networksJson[network];

if (!contractsOrArray) {
  throw new Error(`❌ Network '${network}' not found in networks.json`);
}

const nameToAddress = new Map();

if (Array.isArray(contractsOrArray)) {
  for (const obj of contractsOrArray) {
    for (const [contractName, contractInfo] of Object.entries(obj)) {
      const address = contractInfo.address.toLowerCase();
      nameToAddress.set(contractName, address);
    }
  }
} else {
  for (const [contractName, contractInfo] of Object.entries(contractsOrArray)) {
    const address = contractInfo.address.toLowerCase();
    nameToAddress.set(contractName, address);
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

fs.writeFileSync(outputPath, output);

console.log(`✅ Generated addresses.ts for network: ${network}`);
