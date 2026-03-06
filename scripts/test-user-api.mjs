/**
 * E2E test: User API (OTP auth) at https://dms-rust-omega.vercel.app
 * Tests: send-otp -> verify-otp (with real OTP) -> me -> refresh-token
 *
 * Usage:
 *   node scripts/test-user-api.mjs                          # send-otp only (external API)
 *   node scripts/test-user-api.mjs +919876543210 123456     # full flow (external API)
 *   node scripts/test-user-api.mjs local +919876543210       # send-otp via local proxy
 *   node scripts/test-user-api.mjs local +919876543210 123456 # full flow via local proxy
 */

const useLocal = process.argv[2] === "local";
const phone = useLocal ? process.argv[3] || "+919876543210" : process.argv[2] || "+919876543210";
const otp = useLocal ? process.argv[4] : process.argv[3];
const BASE = process.env.BASE_URL || (useLocal ? "http://localhost:3000" : "https://dms-rust-omega.vercel.app");
const SEND_PATH = useLocal ? "/api/auth/send-otp" : "/api/auth/phone/send-otp";
const VERIFY_PATH = useLocal ? "/api/auth/verify-otp" : "/api/auth/phone/verify-otp";
const ME_PATH = "/api/auth/me";
const PROFILE_PATH = "/api/user/profile";
const REFRESH_PATH = "/api/auth/refresh-token";

function log(name, ok, data) {
  console.log(ok ? `✓ ${name}` : `✗ ${name}`, data !== undefined ? JSON.stringify(data).slice(0, 120) : "");
}

async function test() {
  console.log("Base URL:", BASE);
  console.log("Phone:", phone);
  console.log("");

  // 1. Send OTP
  console.log("1. Send OTP (POST " + SEND_PATH + ")");
  const sendRes = await fetch(`${BASE}${SEND_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber: phone }),
  });
  const sendData = await sendRes.json();
  const sendOk = sendRes.ok && (sendData.success !== false);
  log("Send OTP", sendOk, sendData);
  if (!sendOk) {
    console.log("Response:", JSON.stringify(sendData, null, 2));
    if (!otp) {
      console.log("\nTo verify OTP, run: node scripts/test-user-api.mjs <phone> <otp>");
      return;
    }
  }

  if (!otp) {
    console.log("\nProvide OTP from your phone to continue: node scripts/test-user-api.mjs", phone, "<otp>");
    return;
  }

  // 2. Verify OTP
  console.log("\n2. Verify OTP (POST " + VERIFY_PATH + ")");
  const verifyRes = await fetch(`${BASE}${VERIFY_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber: phone, otp }),
  });
  const verifyData = await verifyRes.json();
  const accessTokenFromVerify = verifyData.accessToken || verifyData.data?.accessToken;
  const verifyOk = verifyRes.ok && (verifyData.success !== false) && accessTokenFromVerify;
  log("Verify OTP", verifyOk, accessTokenFromVerify ? { accessToken: "...", user: verifyData.user } : verifyData);
  if (!verifyOk) {
    console.log("Response:", JSON.stringify(verifyData, null, 2));
    return;
  }

  const accessToken = verifyData.accessToken || verifyData.data?.accessToken;
  const refreshToken = verifyData.refreshToken || verifyData.data?.refreshToken;
  if (!accessToken) {
    console.log("No accessToken in response");
    return;
  }

  // 3. Get current user (GET /api/auth/me)
  console.log("\n3. Get current user (GET " + ME_PATH + ")");
  const meRes = await fetch(`${BASE}${ME_PATH}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const meData = await meRes.json();
  const meOk = meRes.ok && (meData.user != null || meData.data?.user != null);
  log("Get me", meOk, meData.user || meData.data?.user);
  if (!meOk) console.log("Response:", JSON.stringify(meData, null, 2));

  // 3b. Get full profile (GET /api/user/profile) – local proxy only; external may use same path
  console.log("\n3b. Get profile (GET " + PROFILE_PATH + ")");
  const profileRes = await fetch(`${BASE}${PROFILE_PATH}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const profileData = await profileRes.json();
  const profileOk = profileRes.ok && (profileData.user != null || profileData.data?.user != null);
  log("Get profile", profileOk, profileData.user || profileData.data?.user);
  if (!profileOk && profileRes.status !== 404) console.log("Response:", JSON.stringify(profileData, null, 2));

  // 4. Refresh token (if we have refreshToken)
  if (refreshToken) {
    console.log("\n4. Refresh token (POST " + REFRESH_PATH + ")");
    const refreshRes = await fetch(`${BASE}${REFRESH_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const refreshData = await refreshRes.json();
    const refreshOk = refreshRes.ok && refreshData.accessToken;
    log("Refresh token", refreshOk, refreshData.accessToken ? { accessToken: "..." } : refreshData);
  }

  console.log("\nDone.");
}

test().catch((err) => {
  console.error(err);
  process.exit(1);
});
