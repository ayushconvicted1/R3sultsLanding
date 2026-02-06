/**
 * Quick E2E test for auth: signup -> login -> me -> order history
 * Run: node scripts/test-auth.mjs (with dev server running on localhost:3000)
 */
const BASE = "http://localhost:3000";

async function test() {
  const email = `test-${Date.now()}@example.com`;
  const password = "testpass123";

  console.log("1. Signup...");
  const signupRes = await fetch(`${BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      firstName: "Test",
      lastName: "User",
      phone: "",
      line1: "123 Main St",
      city: "City",
      state: "ST",
      postalCode: "12345",
      country: "US",
    }),
  });
  const signupData = await signupRes.json();
  if (!signupRes.ok) {
    console.error("Signup failed:", signupData);
    process.exit(1);
  }
  const token = signupData.token;
  console.log("   OK - token received");

  console.log("2. Login...");
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    console.error("Login failed:", loginData);
    process.exit(1);
  }
  console.log("   OK");

  console.log("3. GET /api/auth/me...");
  const meRes = await fetch(`${BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${loginData.token}` },
  });
  const meData = await meRes.json();
  if (!meRes.ok) {
    console.error("Me failed:", meData);
    process.exit(1);
  }
  console.log("   OK - user:", meData.user?.email);

  console.log("4. GET /api/orders/history...");
  const historyRes = await fetch(`${BASE}/api/orders/history`, {
    headers: { Authorization: `Bearer ${loginData.token}` },
  });
  const historyData = await historyRes.json();
  if (!historyRes.ok) {
    console.error("Order history failed:", historyData);
    process.exit(1);
  }
  console.log("   OK - orders count:", historyData.orders?.length ?? 0);

  console.log("\nAll auth E2E checks passed.");
}

test().catch((err) => {
  console.error(err);
  process.exit(1);
});
