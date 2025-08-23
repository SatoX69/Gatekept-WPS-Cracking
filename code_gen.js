import fs from 'fs';
import path from 'path';
import os from 'os';

// Generate 6 random 6-digit numbers
const numbers = Array.from({ length: 6 }, () => {
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
});

// Save to numbers.json in the current directory
fs.writeFileSync(
  path.join(process.cwd(), 'numbers.json'),
  JSON.stringify(numbers, null, 2),
);

// Handle --force or -f
if (process.argv.includes('--force') || process.argv.includes('-f')) {
  const oseDir = path.join(os.homedir(), '.ose');
  if (!fs.existsSync(oseDir)) fs.mkdirSync(oseDir, { recursive: true });

  const tokenPath = path.join(oseDir, 'tokens.json');
  fs.writeFileSync(tokenPath, JSON.stringify(numbers, null, 2));
}
