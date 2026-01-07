# Fixing Environment Variables Issue

## The Problem

You're seeing "Missing Google Sheets configuration" even though you've added the env variables.

## Common Issues & Solutions

### 1. Variable Name Mismatch ✅ FIXED

- Your `.env` has: `GOOGLE_SHEETS_ID`
- Code now supports both: `GOOGLE_SHEET_ID` and `GOOGLE_SHEETS_ID`

### 2. Multiline JSON in .env ⚠️ NEEDS FIXING

Your credentials JSON is multiline, which doesn't work well in `.env` files.

**Solution:** Minify the JSON to a single line.

#### Option A: Use the minify script

```bash
node minify-credentials.js path/to/your-credentials.json
```

Then copy the output to your `.env` file.

#### Option B: Manual fix

1. Take your entire credentials JSON
2. Remove all line breaks
3. Remove extra spaces between JSON properties
4. Put it all on one line in your `.env`:

```env
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"r3sults-481116",...}
```

### 3. Restart Next.js Dev Server 🔄 REQUIRED

After changing `.env` files, you **must** restart your dev server:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. Check Your .env File Location

Make sure `.env` or `.env.local` is in the **root** of your project (same level as `package.json`).

### 5. Verify Environment Variables Are Loaded

The API route now includes debug logging. Check your terminal/console when you submit a form to see:

- `hasCredentials: true/false`
- `hasSpreadsheetId: true/false`

## Quick Fix Steps

1. **Minify your credentials:**

   ```bash
   # If you have the original JSON file:
   node minify-credentials.js your-credentials.json

   # Or manually: copy your JSON, remove all line breaks, put on one line
   ```

2. **Update your .env file:**

   ```env
   GOOGLE_SHEETS_ID=1DTsEj7SYOJoRIBQqVhzzoECKM03YIlyFDZDO_qj7e5I
   GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"r3sults-481116","private_key_id":"2434c2e03ee7fd01e1e662bcb4f6124557a58978",...}
   ```

3. **Restart your dev server:**

   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

4. **Test again** - the error should be resolved!

## Still Not Working?

Check the server console output when you submit a form. The debug logs will show:

- Whether credentials are being loaded
- Whether the spreadsheet ID is found
- Any JSON parsing errors

If you see `hasCredentials: false`, the environment variable isn't being loaded. Make sure:

- The `.env` file is in the project root
- You've restarted the dev server
- The variable name matches exactly (case-sensitive)
