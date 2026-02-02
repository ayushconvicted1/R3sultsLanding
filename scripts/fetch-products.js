const fs = require("fs");
const path = require("path");
const envPath = path.join(__dirname, "..", ".env.local");
const env = fs.readFileSync(envPath, "utf8");
const m = {};
env.split("\n").forEach((l) => {
  const i = l.indexOf("=");
  if (i > 0) {
    const k = l.slice(0, i).trim();
    let v = l.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    m[k] = v;
  }
});
const domain = (m.DOMAIN_NAME || "").replace(/\/$/, "");
const token = m.AUTH_TOKEN || "";
if (!domain || !token) {
  console.log("Missing DOMAIN_NAME or AUTH_TOKEN");
  process.exit(1);
}
fetch(domain + "/api/products", {
  headers: { Authorization: "Bearer " + token },
})
  .then((r) => r.json())
  .then((d) => console.log(JSON.stringify(d, null, 2)))
  .catch((e) => console.error(e));
