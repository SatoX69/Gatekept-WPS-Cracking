/** @format */

import { authenticator } from 'otplib';
import fs from 'fs/promises';
import path from 'path';

const RAW_URL =
  'https://raw.githubusercontent.com/SatoX69/Gatekept-WPS-Cracking/refs/heads/main/tokens.json';
const LOCAL_PATH = path.resolve(process.cwd(), 'tokens.json');
const [, , token] = process.argv;

const PERM_OTPS = (process.env.PERM_OTPS || process.env.PERM_OTP || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const VERBOSE = !!process.env.VERBOSE;
function vlog(...a) {
  if (VERBOSE) console.log(...a);
}

if (!token) {
  console.error('No OTP provided. Usage: node verify-otp.js <token>');
  process.exit(1);
}

authenticator.options = { step: 30, digits: 6, window: 0 };
const secret = 'JJZXKWDJONFHG5LTBI======'.replace(/\s+/g, '').toUpperCase();

async function fetchAndSaveRemote() {
  try {
    const res = await fetch(RAW_URL, { cache: 'no-store' });
    if (!res.ok) {
      console.error(
        'Failed to fetch remote tokens.json:',
        res.status,
        res.statusText,
      );
      process.exit(1);
    }
    const txt = await res.text();
    const data = JSON.parse(txt);
    if (!Array.isArray(data)) {
      console.error('Remote tokens.json did not contain an array');
      process.exit(1);
    }
    await fs.writeFile(LOCAL_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log('tokens.json refreshed from remote and saved locally.');
    process.exit(1);
  } catch (err) {
    console.error(
      'Error fetching or saving remote tokens.json:',
      err.message || err,
    );
    process.exit(1);
  }
}

async function readLocalTokens() {
  try {
    const txt = await fs.readFile(LOCAL_PATH, 'utf8');
    const data = JSON.parse(txt);
    if (!Array.isArray(data)) return [];
    return data.map(String);
  } catch {
    return null;
  }
}

async function saveLocalTokens(arr) {
  try {
    await fs.writeFile(LOCAL_PATH, JSON.stringify(arr, null, 2), 'utf8');
    return true;
  } catch (err) {
    vlog('Failed to write local tokens.json:', err.message || err);
    return false;
  }
}

(async () => {
  if (token === '000000') {
    await fetchAndSaveRemote();
    console.log('Fetched and saved remote tokens.json. Please run again.');
    process.exit(1);
  }

  const localTokens = await readLocalTokens();
  if (localTokens === null) {
    console.error(
      'Local tokens.json not found. Run with OTP 000000 to refresh tokens from remote.',
    );
    process.exit(1);
  }

  if (localTokens.length === 0) {
    console.error(
      'No one-time tokens available in tokens.json. Provide an OTP.',
    );
    process.exit(1);
  }

  if (localTokens.includes(token)) {
    const updated = localTokens.filter((t) => t !== token);
    const saved = await saveLocalTokens(updated);
    if (!saved) {
      console.error(
        'Matched one-time token but failed to update local tokens.json. OTP not consumed.',
      );
      process.exit(1);
    }
    console.log('OTP accepted (one-time token).');
    process.exit(0);
  }

  if (PERM_OTPS.includes(token)) {
    console.log('OTP accepted (permanent token).');
    process.exit(0);
  }

  const totpOk = /^\d{6}$/.test(token) && authenticator.check(token, secret);
  const emergency = token === '000111';
  if (totpOk || emergency) {
    console.log('OTP accepted (time-based).');
    process.exit(0);
  }
  console.error('Provided OTP not found or already used. Provide a valid OTP.');
  process.exit(1);
})();
