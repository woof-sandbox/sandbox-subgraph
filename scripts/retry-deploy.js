// Useful when The Graph has problems with their services
import { exec } from 'child_process';

const network = process.env.NETWORK;

if (!network) {
  console.error('❌ Please provide a network name (e.g. sepolia)');
  process.exit(1);
}

const command = `npm run deploy:${network}`;

const run = () => {
  console.log(`🚀 Running: ${command}`);
  const p = exec(command, { stdio: 'inherit' });

  p.stdout.pipe(process.stdout);
  p.stderr.pipe(process.stderr);

  p.on('exit', (code) => {
    if (code === 0) {
      console.log('✅ Success');
      process.exit(0);
    } else {
      console.log('❌ Failed. Retrying in 10 seconds...');
      setTimeout(run, 10000);
    }
  });
};

run();
