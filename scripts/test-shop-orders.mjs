#!/usr/bin/env node
/**
 * End-to-end tests for Shop Orders API (via local proxy).
 * Uses BASE from env or http://localhost:3000.
 * For GET my / my/:id you need a valid JWT (set AUTH_TOKEN in env or pass as arg).
 *
 * Run: node scripts/test-shop-orders.mjs
 * Or:  AUTH_TOKEN=your_jwt node scripts/test-shop-orders.mjs
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN || process.env.auth_token || "";

async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (AUTH_TOKEN) headers["Authorization"] = `Bearer ${AUTH_TOKEN}`;
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { _raw: text };
  }
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  console.log("BASE:", BASE);
  console.log("AUTH_TOKEN:", AUTH_TOKEN ? `${AUTH_TOKEN.slice(0, 20)}...` : "(none)");
  console.log("");

  // 1. POST /api/shop/orders (create order — public)
  console.log("1. POST /api/shop/orders (create order, no auth)");
  const createRes = await request("/api/shop/orders", {
    method: "POST",
    body: JSON.stringify({
      lineItems: [
        {
          productId: "test-product-001",
          name: "Test Product",
          price: 29.99,
          quantity: 1,
          image: "https://example.com/img.png",
          size: "M",
          color: "Black",
        },
      ],
      shippingAddress: {
        firstName: "Test",
        lastName: "User",
        email: "test-shop@example.com",
        phone: "+1234567890",
        line1: "123 Main St",
        line2: "",
        city: "NYC",
        state: "NY",
        postalCode: "10001",
        country: "US",
      },
      billingSameAsShipping: true,
      shippingAmount: 5.99,
    }),
  });
  console.log("   Status:", createRes.status, createRes.ok ? "OK" : "FAIL");
  if (createRes.data?.success && createRes.data?.data?.orderId) {
    console.log("   Order ID:", createRes.data.data.orderId);
  } else if (createRes.data?.error) {
    console.log("   Error:", createRes.data.error);
  } else {
    console.log("   Response:", JSON.stringify(createRes.data).slice(0, 200));
  }
  console.log("");

  // 2. GET /api/shop/orders/my (requires auth)
  console.log("2. GET /api/shop/orders/my (authenticated)");
  const myRes = await request("/api/shop/orders/my");
  console.log("   Status:", myRes.status, myRes.ok ? "OK" : myRes.status === 401 ? "Unauthorized (expected if no token)" : "FAIL");
  if (myRes.data?.success && Array.isArray(myRes.data?.data)) {
    console.log("   Orders count:", myRes.data.data.length);
    if (myRes.data.pagination) console.log("   Pagination:", myRes.data.pagination);
  } else if (myRes.status === 401) {
    console.log("   (No token or invalid token — use AUTH_TOKEN=your_jwt to test)");
  } else if (myRes.data?.error) {
    console.log("   Error:", myRes.data.error);
  }
  console.log("");

  // 3. GET /api/shop/orders/my/:id (requires auth)
  console.log("3. GET /api/shop/orders/my/ORD-TEST (authenticated)");
  const oneRes = await request("/api/shop/orders/my/ORD-TEST");
  console.log("   Status:", oneRes.status, oneRes.ok ? "OK" : oneRes.status === 401 ? "Unauthorized" : "FAIL");
  if (oneRes.data?.success && oneRes.data?.data) {
    console.log("   Order:", oneRes.data.data.orderId || oneRes.data.data.id);
  } else if (oneRes.status === 401) {
    console.log("   (No token — use AUTH_TOKEN=your_jwt to test)");
  } else if (oneRes.data?.error) {
    console.log("   Error:", oneRes.data.error);
  }
  console.log("");

  console.log("Done. Ensure backend is at DOMAIN_NAME/USER_API_BASE_URL and has shop orders routes.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
