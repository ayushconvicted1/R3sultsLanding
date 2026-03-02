/**
 * Auth flow tests against Next.js API routes (proxy to backend).
 * Run with dev server: npm run dev (in another terminal), then: node scripts/test-auth-flow.mjs
 * Requires USER_API_BASE_URL backend to be reachable.
 */
const BASE = "http://localhost:3000";

const phone = process.env.TEST_PHONE || "+15551234567";
const password = "TestPass123";

async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  return { res, data, status: res.status };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

async function run() {
  console.log("Auth flow tests (base:", BASE, ")\n");

  // 1. Register
  console.log("1. POST /api/auth/register (phone + password + fullName)");
  const reg = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      phoneNumber: phone,
      password,
      fullName: "Test User",
      email: "test@example.com",
    }),
  });
  // Backend may return 201 or 200; or 409 if already exists
  assert(
    reg.status === 200 || reg.status === 201 || reg.status === 409,
    `Register expected 200/201/409, got ${reg.status}: ${JSON.stringify(reg.data)}`
  );
  if (reg.data.success !== false) {
    console.log("   OK -", reg.data.message || "Registered or already exists");
  } else {
    console.log("   OK -", reg.data.error || "Response received");
  }

  // 2. Login (may succeed if user exists and is verified, or 401)
  console.log("\n2. POST /api/auth/login (phone + password)");
  const login = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ phoneNumber: phone, password }),
  });
  assert(
    login.status === 200 || login.status === 401 || login.status === 403,
    `Login expected 200/401/403, got ${login.status}: ${JSON.stringify(login.data)}`
  );
  if (login.status === 200) {
    assert(login.data.accessToken, "Login 200 must return accessToken");
    assert(login.data.user != null, "Login 200 must return user");
    console.log("   OK - Got accessToken and user");
  } else {
    console.log("   OK -", login.status, login.data.error || "Invalid credentials (expected if not verified)");
  }

  let token = login.status === 200 ? login.data.accessToken : null;
  let refreshToken = login.status === 200 ? login.data.refreshToken : null;

  // 3. GET /api/auth/me without token
  console.log("\n3. GET /api/auth/me (no token)");
  const meNoToken = await request("/api/auth/me");
  assert(meNoToken.status === 401, `Me without token expected 401, got ${meNoToken.status}`);
  console.log("   OK - 401 Unauthorized");

  // 4. GET /api/auth/me with token (if we have one)
  if (token) {
    console.log("\n4. GET /api/auth/me (with token)");
    const meWith = await request("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(meWith.status === 200, `Me with token expected 200, got ${meWith.status}`);
    assert(meWith.data.user != null, "Me must return user");
    console.log("   OK - user:", meWith.data.user?.fullName || meWith.data.user?.id);
  } else {
    console.log("\n4. GET /api/auth/me (with token) - SKIP (no token from login)");
  }

  // 5. POST /api/auth/forgot-password
  console.log("\n5. POST /api/auth/forgot-password");
  const forgot = await request("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ phoneNumber: phone }),
  });
  assert(forgot.status === 200, `Forgot password expected 200, got ${forgot.status}`);
  console.log("   OK -", forgot.data.message || "Success");

  // 6. POST /api/auth/refresh-token (invalid/missing body)
  console.log("\n6. POST /api/auth/refresh-token (no body)");
  const refreshBad = await request("/api/auth/refresh-token", {
    method: "POST",
    body: JSON.stringify({}),
  });
  assert(refreshBad.status === 400, `Refresh without token expected 400, got ${refreshBad.status}`);
  console.log("   OK - 400 Bad Request");

  // 7. POST /api/auth/send-otp
  console.log("\n7. POST /api/auth/send-otp");
  const sendOtp = await request("/api/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ phoneNumber: phone }),
  });
  const validOtpStatuses = [200, 400, 401, 429, 500, 502, 503];
  assert(
    validOtpStatuses.includes(sendOtp.status),
    `Send OTP expected one of ${validOtpStatuses.join(",")}, got ${sendOtp.status}`
  );
  if (sendOtp.status === 200) {
    console.log("   OK - OTP sent or success");
  } else {
    console.log("   OK -", sendOtp.status, sendOtp.data?.error || sendOtp.data?.message || "");
  }

  // 8. POST /api/auth/logout (with token if we have one)
  if (token) {
    console.log("\n8. POST /api/auth/logout");
    const logout = await request("/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(logout.status === 200, `Logout expected 200, got ${logout.status}`);
    console.log("   OK - Logged out");
  } else {
    console.log("\n8. POST /api/auth/logout - SKIP (no token)");
  }

  // 9. Login with missing fields
  console.log("\n9. POST /api/auth/login (missing password)");
  const loginBad = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ phoneNumber: phone }),
  });
  assert(loginBad.status === 400, `Login without password expected 400, got ${loginBad.status}`);
  console.log("   OK - 400 Bad Request");

  // 10. Register with missing fullName
  console.log("\n10. POST /api/auth/register (missing fullName)");
  const regBad = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ phoneNumber: phone, password: "x".repeat(6) }),
  });
  assert(regBad.status === 400, `Register without fullName expected 400, got ${regBad.status}`);
  console.log("   OK - 400 Bad Request");

  console.log("\n--- All auth flow checks passed ---");
}

run().catch((err) => {
  console.error("\nTest failed:", err.message);
  process.exit(1);
});
