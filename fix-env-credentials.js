#!/usr/bin/env node

/**
 * Script to extract and minify Google Sheets credentials from .env file
 * This fixes the multiline JSON issue in .env files
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.error('Error: .env file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

let inCredentials = false;
let credentialsLines = [];
let credentialsStartIndex = -1;

// Find the credentials section
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.startsWith('GOOGLE_SHEETS_CREDENTIALS=')) {
    inCredentials = true;
    credentialsStartIndex = i;
    // Check if it's all on one line
    if (line.includes('{') && line.includes('}')) {
      console.log('Credentials are already on one line');
      process.exit(0);
    }
    // Get the opening brace if it's on the same line
    if (line.includes('{')) {
      const braceIndex = line.indexOf('{');
      credentialsLines.push(line.substring(braceIndex));
    } else {
      credentialsLines.push('{');
    }
  } else if (inCredentials) {
    if (line.trim() === '}') {
      credentialsLines.push('}');
      break;
    } else if (line.trim().startsWith('}')) {
      credentialsLines.push('}');
      break;
    } else {
      credentialsLines.push(line);
    }
  }
}

if (credentialsLines.length === 0) {
  console.error('Error: Could not find GOOGLE_SHEETS_CREDENTIALS in .env file');
  process.exit(1);
}

// Join and parse the JSON
const credentialsJson = credentialsLines.join('\n');

try {
  const parsed = JSON.parse(credentialsJson);
  const minified = JSON.stringify(parsed);
  
  // Create backup
  const backupPath = path.join(__dirname, '.env.backup');
  fs.writeFileSync(backupPath, envContent);
  console.log(`✅ Backup created: ${backupPath}`);
  
  // Replace the multiline credentials with minified version
  const newLines = [...lines];
  // Remove old credentials lines
  newLines.splice(credentialsStartIndex, credentialsLines.length, `GOOGLE_SHEETS_CREDENTIALS=${minified}`);
  
  // Write updated .env
  fs.writeFileSync(envPath, newLines.join('\n'));
  
  console.log('\n✅ Successfully minified credentials in .env file!');
  console.log('📝 Credentials are now on a single line.');
  console.log('\n⚠️  IMPORTANT: Restart your Next.js dev server for changes to take effect!');
  console.log('   Run: npm run dev\n');
  
} catch (error) {
  console.error('Error parsing credentials JSON:', error.message);
  console.error('\nPlease ensure the JSON in your .env file is valid.');
  process.exit(1);
}

