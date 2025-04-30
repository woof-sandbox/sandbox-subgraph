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

let output = `// Auto-generated file. Do not edit manually.\n`;
output += `export const ADDRESSES = {\n`;

for (const [name, address] of nameToAddress.entries()) {
  output += `  ${name}: "${address}",\n`;
}

output += `};\n`;

fs.writeFileSync(outputPath, output);

console.log(`✅ Generated addresses.ts for network: ${network}`);
