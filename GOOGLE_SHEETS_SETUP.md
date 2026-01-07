# Google Sheets API Setup Guide

This guide will help you set up Google Sheets integration to collect emails from the website.

## Prerequisites

1. A Google Cloud Project
2. Google Sheets API enabled
3. A Google Sheet created for storing emails

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `r3sults-email-collector` (or any name you prefer)
   - Click "Create and Continue"
   - Skip the optional steps and click "Done"

## Step 3: Generate Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the JSON file (keep it secure!)

## Step 4: Share Google Sheet with Service Account

1. Open your Google Sheet (or create a new one)
2. Click the "Share" button
3. Add the service account email (found in the JSON file as `client_email`)
4. Give it "Editor" permissions
5. Copy the Sheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
   - Copy the `{SHEET_ID}` part

## Step 5: Prepare Your Sheet

Create a sheet with the following headers in row 1:

- Column A: `Timestamp`
- Column B: `Email`
- Column C: `Source` (newsletter, guide, contact)
- Column D: `Guide Title` (optional, for guide downloads)

## Step 6: Set Environment Variables

Create a `.env.local` file in the root of your project:

```env
# Service Account Credentials (JSON string, minified)
# Copy the entire JSON content from the downloaded file and minify it
# You can use an online JSON minifier or just remove all line breaks
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"your-project",...}

# Google Sheet ID (from the URL)
GOOGLE_SHEET_ID=your_sheet_id_here
```

### Important Notes:

1. **Minify the JSON**: The credentials should be a single-line JSON string. Remove all line breaks and spaces between keys/values.

2. **Security**: Never commit `.env.local` to version control. It's already in `.gitignore`.

3. **Format Example**:
   ```env
   GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"my-project","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"service@project.iam.gserviceaccount.com","client_id":"123456","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/service%40project.iam.gserviceaccount.com"}
   ```

## Step 7: Test the Integration

1. Start your development server: `npm run dev`
2. Try submitting an email through:
   - Newsletter form
   - Guide download modal
3. Check your Google Sheet to verify the data is being saved

## Troubleshooting

- **"Missing Google Sheets configuration"**: Check that both environment variables are set
- **"Invalid credentials format"**: Ensure the JSON is properly minified and escaped
- **"Permission denied"**: Make sure you've shared the sheet with the service account email
- **"Sheet not found"**: Verify the Sheet ID is correct

## API Endpoint

The API endpoint is available at: `/api/email`

**Request Body:**

```json
{
  "email": "user@example.com",
  "source": "newsletter" | "guide" | "contact",
  "guideTitle": "Optional guide title for guide downloads"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email saved successfully"
}
```
