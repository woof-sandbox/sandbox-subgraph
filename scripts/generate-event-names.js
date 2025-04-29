import { keccak256, toUtf8Bytes } from "ethers";
import fs from "fs";
import path from "path";

const ABI_FOLDER = "./abis";
const OUTPUT_FILE = "./generated/event-names.ts";

const eventSignatures = new Map();

const files = fs.readdirSync(ABI_FOLDER);

for (const file of files) {
  if (file.endsWith(".json")) {
    const filePath = path.join(ABI_FOLDER, file);

    const fileContent = fs.readFileSync(filePath, "utf8").trim();
    if (fileContent.length === 0) {
      console.warn(`⚠️ Skipping empty ABI file: ${file}`);
      continue;
    }

    let abiJson;
    try {
      abiJson = JSON.parse(fileContent);
    } catch (e) {
      console.error(`❌ Failed to parse JSON in file ${file}: ${e.message}`);
      process.exit(1);
    }

    for (const item of abiJson) {
      if (item.type === "event") {
        const inputs = item.inputs.map((input) => input.type).join(",");
        const signatureString = `${item.name}(${inputs})`;
        const hash = keccak256(toUtf8Bytes(signatureString)).toLowerCase();
        eventSignatures.set(hash, signatureString);
      }
    }
  }
}

// Preparing TypedMap

let output = `// Auto-generated file. Do not edit manually.\n`;
output += `import { TypedMap } from "@graphprotocol/graph-ts";\n\n`;
output += `export let EVENT_NAMES = new TypedMap<string, string>();\n\n`;

for (const [hash, signature] of eventSignatures.entries()) {
  output += `EVENT_NAMES.set("${hash}", "${signature}");\n`;
}

fs.writeFileSync(OUTPUT_FILE, output);

console.log(`✅ Generated event-names.ts with ${eventSignatures.size} events`);
