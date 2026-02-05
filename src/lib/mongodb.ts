import { MongoClient, Db } from "mongodb";

const DB_NAME = "results_disaster_management";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(DB_NAME);
  return db;
}

export function getOrdersCollection() {
  return getDb().then((d) => d.collection<OrderDocument>("orders"));
}

/** Line item as stored in MongoDB (with product id and full info). amount_total in dollars (e.g. 250.00). */
export interface OrderLineItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  amount_total?: number; // dollars (e.g. 250.00)
  image?: string;
  description?: string;
  size?: string;
  color?: string;
  productDescription?: string;
}

/** Order as stored in MongoDB (orders collection). amount_total in dollars (e.g. 250.00). */
export interface OrderDocument {
  _id?: unknown;
  id: string;
  stripe_session_id: string;
  customer_email: string;
  amount_total: number; // dollars (e.g. 250.00) = subtotal + shipping
  amount_subtotal?: number; // dollars before shipping
  shipping_amount?: number; // dollars (e.g. 5.99)
  currency: string;
  payment_status: string;
  shipping_address: {
    firstName?: string;
    lastName?: string;
    fullName?: string; // legacy
    email?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    [key: string]: unknown;
  };
  billing_address?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    [key: string]: unknown;
  };
  billing_same_as_shipping?: boolean;
  line_items: OrderLineItem[];
  created_at: string;
}
