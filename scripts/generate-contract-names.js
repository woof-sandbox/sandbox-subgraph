import fs from "fs";

const network = process.env.NETWORK;

if (!network) {
  throw new Error("Please set NETWORK env variable (e.g., NETWORK=mainnet)");
}

const networksJson = JSON.parse(fs.readFileSync("./networks.json", "utf8"));
const contractsOrArray = networksJson[network];

if (!contractsOrArray) {
  throw new Error(`Network '${network}' not found in networks.json`);
}

const addressToName = new Map();

if (Array.isArray(contractsOrArray)) {
  for (const obj of contractsOrArray) {
    for (const [contractName, contractInfo] of Object.entries(obj)) {
      const address = contractInfo.address.toLowerCase();
      addressToName.set(address, contractName);
    }
  }
} else {
  for (const [contractName, contractInfo] of Object.entries(contractsOrArray)) {
    const address = contractInfo.address.toLowerCase();
    addressToName.set(address, contractName);
  }
}

let output = `// Auto-generated file. Do not edit manually.\n`;
output += `import { TypedMap } from "@graphprotocol/graph-ts";\n\n`;
output += `export let CONTRACT_NAMES = new TypedMap<string, string>();\n\n`;

for (const [address, name] of addressToName.entries()) {
  output += `CONTRACT_NAMES.set("${address.toLowerCase()}", "${name}");\n`;
}

fs.writeFileSync("./generated/contract-names.ts", output);

console.log(`✅ Generated contract-names.ts for network: ${network}`);
