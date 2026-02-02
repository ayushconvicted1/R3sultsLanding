/**
 * Seed dummy orders into MongoDB (results_disaster_management.orders) with:
 * - Latest schema: firstName, lastName in shipping_address; line_items with productId and full product info
 * - Real products fetched from /api/products (app must be running, or set API_BASE_URL)
 *
 * Run from project root: npm run seed:orders  (or node scripts/seed-orders.mjs)
 * Requires MONGODB_URI in .env.local. Optional: API_BASE_URL (default http://localhost:3000)
 */
import { config } from "dotenv";
import { MongoClient } from "mongodb";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const DB_NAME = "results_disaster_management";
const COLLECTION = "orders";
const API_BASE = (process.env.API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

function normalizeProduct(p) {
  const id = String(p._id ?? p.id ?? "");
  const name = String(p.name ?? p.title ?? "");
  let price = 0;
  if (typeof p.sellingPrice === "number") price = p.sellingPrice;
  else if (typeof p.price === "number") price = p.price;
  const description = p.description != null ? String(p.description).slice(0, 500) : undefined;
  let image;
  if (Array.isArray(p.images) && p.images.length > 0 && p.images[0]?.url) {
    image = p.images[0].url;
  } else if (typeof p.image === "string") {
    image = p.image;
  }
  return { id, name, price, description, image };
}

async function fetchProducts() {
  const url = `${API_BASE}/api/products?limit=50`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Products API failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  const list = data?.data?.products ?? data?.products ?? data?.data ?? (Array.isArray(data) ? data : []);
  const arr = Array.isArray(list) ? list : [];
  return arr.map(normalizeProduct).filter((p) => p.id && p.name);
}

function buildLineItem(product, quantity = 1, options = {}) {
  const amountDollars = Math.round(product.price * quantity * 100) / 100;
  return {
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity,
    amount_total: amountDollars,
    image: product.image,
    productDescription: product.description,
    ...options,
  };
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set. Add it to .env.local and run again.");
    process.exit(1);
  }

  console.log("Fetching products from", API_BASE + "/api/products ...");
  let products = [];
  try {
    products = await fetchProducts();
    console.log("Fetched", products.length, "products");
  } catch (err) {
    console.warn("Could not fetch products:", err.message);
    console.warn("Seeding with placeholder line items (no real product ids).");
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const coll = db.collection(COLLECTION);

    const deleted = await coll.deleteMany({ id: { $regex: /^ord_seed_/ } });
    if (deleted.deletedCount > 0) {
      console.log("Removed", deleted.deletedCount, "existing seed order(s)");
    }

    const orders = [];
    const now = Date.now();
    const oneDay = 86400000;

    const dummyOrdersConfig = [
      { firstName: "John", lastName: "Doe", email: "john.doe@example.com", city: "New York", state: "NY", postalCode: "10001", numItems: 2, dayOffset: 3 },
      { firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", city: "Los Angeles", state: "CA", postalCode: "90001", numItems: 1, dayOffset: 2 },
      { firstName: "Alex", lastName: "Wilson", email: "alex.wilson@example.com", city: "Chicago", state: "IL", postalCode: "60601", numItems: 2, dayOffset: 1 },
      { firstName: "Sarah", lastName: "Lee", email: "sarah.lee@example.com", city: "Houston", state: "TX", postalCode: "77001", numItems: 1, dayOffset: 0 },
      { firstName: "Mike", lastName: "Brown", email: "mike.brown@example.com", city: "Phoenix", state: "AZ", postalCode: "85001", numItems: 2, dayOffset: 5 },
    ];

    for (let i = 0; i < 5; i++) {
      const cfg = dummyOrdersConfig[i];
      const lineItems = [];
      if (products.length >= cfg.numItems) {
        for (let j = 0; j < cfg.numItems; j++) {
          const product = products[(i * 3 + j) % products.length];
          const qty = j === 0 ? 2 : 1;
          lineItems.push(buildLineItem(product, qty));
        }
      } else {
        const fallbackItems = [
          { name: "Emergency Kit Pro", price: 39.99, id: "fallback_1", description: "Full emergency kit" },
          { name: "First Aid Pack", price: 29.99, id: "fallback_2", description: "Standard first aid" },
        ];
        lineItems.push(buildLineItem(fallbackItems[0], 2));
        if (cfg.numItems > 1) lineItems.push(buildLineItem(fallbackItems[1], 1));
      }
      const amountTotalDollars = Math.round(lineItems.reduce((s, it) => s + (it.amount_total ?? it.price * it.quantity), 0) * 100) / 100;

      orders.push({
        id: `ord_seed_${String(i + 1).padStart(3, "0")}_${now.toString(36).slice(-6)}`,
        stripe_session_id: `cs_seed_dummy_${String(i + 1).padStart(3, "0")}`,
        customer_email: cfg.email,
        amount_total: amountTotalDollars,
        currency: "usd",
        payment_status: "paid",
        shipping_address: {
          firstName: cfg.firstName,
          lastName: cfg.lastName,
          email: cfg.email,
          line1: `${100 + i} Main St`,
          line2: i === 0 ? "Apt 4" : undefined,
          city: cfg.city,
          state: cfg.state,
          postalCode: cfg.postalCode,
          country: "US",
        },
        line_items: lineItems,
        created_at: new Date(now - oneDay * cfg.dayOffset).toISOString(),
      });
    }

    const result = await coll.insertMany(orders);
    console.log("Seeded", result.insertedCount, "dummy orders into", DB_NAME + "." + COLLECTION, "with latest schema (firstName, lastName; line_items with productId and full info).");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
