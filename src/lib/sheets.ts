import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function parseCredentials(credentials: string): Record<string, unknown> {
  let cleaned = credentials.trim();
  if (!cleaned.startsWith("{")) {
    const start = cleaned.indexOf("{");
    if (start !== -1) cleaned = cleaned.substring(start);
  }
  const end = cleaned.lastIndexOf("}");
  if (end !== -1 && end > 0) cleaned = cleaned.substring(0, end + 1);
  cleaned = cleaned
    .replace(/\r\n/g, " ")
    .replace(/\n/g, " ")
    .replace(/\r/g, " ")
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*,\s*/g, ",")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s+/g, " ")
    .trim();
  return JSON.parse(cleaned) as Record<string, unknown>;
}

function getSheets() {
  const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEETS_ID;
  if (!credentials || !spreadsheetId) {
    throw new Error("Missing GOOGLE_SHEETS_CREDENTIALS or GOOGLE_SHEETS_ID");
  }
  const auth = new google.auth.GoogleAuth({
    credentials: parseCredentials(credentials),
    scopes: SCOPES,
  });
  return { sheets: google.sheets({ version: "v4", auth }), spreadsheetId };
}

const ORDERS_SHEET = "Orders";
const ORDERS_HEADERS = [
  "id",
  "stripe_session_id",
  "customer_email",
  "amount_total_cents",
  "currency",
  "payment_status",
  "shipping_address_json",
  "line_items_json",
  "created_at",
];

export interface OrderRow {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  amount_total_cents: number;
  currency: string;
  payment_status: string;
  shipping_address_json: string;
  line_items_json: string;
  created_at: string;
}

export async function appendOrder(order: OrderRow): Promise<void> {
  const { sheets, spreadsheetId } = getSheets();
  const row = [
    order.id,
    order.stripe_session_id,
    order.customer_email,
    String(order.amount_total_cents),
    order.currency,
    order.payment_status,
    order.shipping_address_json,
    order.line_items_json,
    order.created_at,
  ];
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${ORDERS_SHEET}!A:I`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

export async function ensureOrdersSheet(): Promise<void> {
  const { sheets, spreadsheetId } = getSheets();
  const res = await sheets.spreadsheets.get({ spreadsheetId });
  const hasOrders = res.data.sheets?.some(
    (s) => (s.properties?.title ?? "").toLowerCase() === ORDERS_SHEET.toLowerCase()
  );
  if (!hasOrders) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: { title: ORDERS_SHEET },
            },
          },
        ],
      },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${ORDERS_SHEET}!A1:I1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [ORDERS_HEADERS] },
    });
  } else {
    const rangeRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${ORDERS_SHEET}!A1:I1`,
    });
    const firstRow = rangeRes.data.values?.[0];
    if (!firstRow || firstRow.length < 2) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${ORDERS_SHEET}!A1:I1`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [ORDERS_HEADERS] },
      });
    }
  }
}

export async function getOrders(): Promise<OrderRow[]> {
  const { sheets, spreadsheetId } = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${ORDERS_SHEET}!A:I`,
  });
  const rows = res.data.values as string[][] | undefined;
  if (!rows || rows.length < 2) return [];
  const headers = rows[0].map((h) => String(h).toLowerCase().replace(/\s/g, "_"));
  const orders: OrderRow[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;
    const obj: Record<string, string> = {};
    headers.forEach((h, j) => {
      obj[h] = row[j] ?? "";
    });
    orders.push({
      id: obj.id ?? obj.stripe_session_id ?? "",
      stripe_session_id: obj.stripe_session_id ?? "",
      customer_email: obj.customer_email ?? "",
      amount_total_cents: parseInt(obj.amount_total_cents ?? "0", 10) || 0,
      currency: obj.currency ?? "usd",
      payment_status: obj.payment_status ?? "",
      shipping_address_json: obj.shipping_address_json ?? "{}",
      line_items_json: obj.line_items_json ?? "[]",
      created_at: obj.created_at ?? "",
    });
  }
  return orders.reverse();
}
