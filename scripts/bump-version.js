import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, '../versions.json');
const network = process.argv[2];

if (!network) {
  console.error('❌ Please specify network. Example: npm run bump:version sepolia');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error('❌ versions.json not found');
  process.exit(1);
}

const versions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

if (!versions[network]) {
  console.warn(`⚠️ No version found for network: ${network}. Creating with initial version 0.0.1.`);
  versions[network] = '0.0.1';
} else {
  let [major, minor, patch] = versions[network].split('.').map(Number);
  patch += 1;
  versions[network] = `${major}.${minor}.${patch}`;
}

fs.writeFileSync(filePath, JSON.stringify(versions, null, 2));

console.log(`✅ Bumped ${network} version to ${versions[network]}`);
