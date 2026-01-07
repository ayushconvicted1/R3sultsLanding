#!/usr/bin/env node

/**
 * Script to minify Google Sheets credentials JSON for .env file
 * Usage: node minify-credentials.js <path-to-credentials.json>
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node minify-credentials.js <path-to-credentials.json>');
  process.exit(1);
}

const credentialsPath = args[0];

if (!fs.existsSync(credentialsPath)) {
  console.error(`Error: File not found: ${credentialsPath}`);
  process.exit(1);
}

try {
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  const minified = JSON.stringify(credentials);
  
  console.log('\n✅ Minified credentials (copy this to your .env file):\n');
  console.log(`GOOGLE_SHEETS_CREDENTIALS=${minified}`);
  console.log('\n');
} catch (error) {
  console.error('Error parsing credentials:', error.message);
  process.exit(1);
}

