import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

interface EmailSubmission {
  email: string;
  source: string; // 'newsletter' | 'guide' | 'contact'
  guideTitle?: string; // Optional, only for guide downloads
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailSubmission = await request.json();
    const { email, source, guideTitle } = body;

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Validate source
    if (!source) {
      return NextResponse.json(
        { error: "Source is required" },
        { status: 400 }
      );
    }

    // Get environment variables (support both naming conventions)
    const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
    const spreadsheetId =
      process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEETS_ID;

    // Debug logging (remove in production)
    console.log("Environment check:", {
      hasCredentials: !!credentials,
      credentialsLength: credentials?.length || 0,
      hasSpreadsheetId: !!spreadsheetId,
      spreadsheetId: spreadsheetId,
    });

    if (!credentials || !spreadsheetId) {
      console.error("Missing Google Sheets configuration", {
        credentials: credentials ? "exists" : "missing",
        spreadsheetId: spreadsheetId ? "exists" : "missing",
      });
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: {
            hasCredentials: !!credentials,
            hasSpreadsheetId: !!spreadsheetId,
          },
        },
        { status: 500 }
      );
    }

    // Parse credentials (handle multiline JSON from .env file)
    let auth;
    try {
      // The credentials might start with whitespace/newlines if formatted in .env
      let cleanedCredentials = credentials.trim();

      // Remove any leading characters before the first {
      if (!cleanedCredentials.startsWith("{")) {
        const jsonStart = cleanedCredentials.indexOf("{");
        if (jsonStart !== -1) {
          cleanedCredentials = cleanedCredentials.substring(jsonStart);
        }
      }

      // Find the last } to ensure we have the complete JSON
      const jsonEnd = cleanedCredentials.lastIndexOf("}");
      if (jsonEnd !== -1 && jsonEnd > 0) {
        cleanedCredentials = cleanedCredentials.substring(0, jsonEnd + 1);
      }

      // Now clean up the multiline JSON by replacing newlines with spaces
      // This preserves the JSON structure while making it parseable
      cleanedCredentials = cleanedCredentials
        .replace(/\r\n/g, " ") // Windows line endings
        .replace(/\n/g, " ") // Unix line endings
        .replace(/\r/g, " ") // Old Mac line endings
        .replace(/\s*{\s*/g, "{") // Normalize opening braces
        .replace(/\s*}\s*/g, "}") // Normalize closing braces
        .replace(/\s*,\s*/g, ",") // Normalize commas
        .replace(/\s*:\s*/g, ":") // Normalize colons
        .replace(/\s+/g, " ") // Multiple spaces to single
        .trim();

      // Parse the cleaned JSON
      const credentialsJson = JSON.parse(cleanedCredentials);
      auth = new google.auth.GoogleAuth({
        credentials: credentialsJson,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    } catch (error) {
      console.error("Error parsing credentials:", error);
      // Log first 100 chars for debugging (safe - no sensitive data in first part)
      const preview = credentials.substring(0, 100);
      console.error("Credentials preview:", preview);
      console.error("Credentials length:", credentials.length);
      console.error("Starts with {:", credentials.trim().startsWith("{"));

      return NextResponse.json(
        {
          error: "Invalid credentials format",
          details: error instanceof Error ? error.message : "Unknown error",
          hint: "Make sure GOOGLE_SHEETS_CREDENTIALS is a valid JSON string (can be multiline, but must be valid JSON)",
        },
        { status: 500 }
      );
    }

    // Initialize Google Sheets API
    const sheets = google.sheets({ version: "v4", auth });

    // Prepare the row data
    const timestamp = new Date().toISOString();
    const rowData = [timestamp, email, source, guideTitle || ""];

    // Append data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:D", // Adjust range based on your sheet structure
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowData],
      },
    });

    return NextResponse.json(
      { success: true, message: "Email saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving email to Google Sheets:", error);
    return NextResponse.json(
      { error: "Failed to save email" },
      { status: 500 }
    );
  }
}
