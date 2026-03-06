import nodemailer from "nodemailer";
import type { OrderDocument } from "./mongodb";

function formatAddress(addr: Record<string, unknown> | undefined): string {
  if (!addr) return "—";
  const first = (addr.firstName as string) || "";
  const last = (addr.lastName as string) || "";
  const full = [first, last].filter(Boolean).join(" ");
  const line1 = (addr.line1 as string) || "";
  const line2 = (addr.line2 as string) || "";
  const city = (addr.city as string) || "";
  const state = (addr.state as string) || "";
  const postal = (addr.postalCode as string) || "";
  const country = (addr.country as string) || "";
  const phone = (addr.phone as string) || "";
  const parts = [
    full && `<strong>${escapeHtml(full)}</strong>`,
    line1 && escapeHtml(line1),
    line2 && escapeHtml(line2),
    [city, state, postal].filter(Boolean).join(", ") && escapeHtml([city, state, postal].filter(Boolean).join(", ")),
    country && escapeHtml(country),
    phone && `Phone: ${escapeHtml(phone)}`,
  ].filter(Boolean);
  return parts.join("<br/>") || "—";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getPortalUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "https://r3sults-landing.vercel.app";
  return url.replace(/\/$/, "");
}

function buildOrderConfirmationHtml(order: OrderDocument): string {
  const portalUrl = getPortalUrl();
  const ship = order.shipping_address ?? {};
  const bill = order.billing_address;
  const currency = (order.currency || "usd").toUpperCase();
  const date = order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", { dateStyle: "long" }) : "";
  const shippingAmount = order.shipping_amount ?? 0;
  const subtotal = order.amount_subtotal ?? Math.round((order.amount_total - shippingAmount) * 100) / 100;
  const total = order.amount_total ?? subtotal + shippingAmount;

  const hasImages = (order.line_items ?? []).some((i) => i.image);
  const thead = hasImages
    ? `<tr style="background:#f8fafc;">
        <th style="padding:10px 12px;text-align:left;font-weight:600;color:#334155;font-size:12px;width:64px;"></th>
        <th style="padding:10px 12px;text-align:left;font-weight:600;color:#334155;font-size:12px;">Item</th>
        <th style="padding:10px 12px;text-align:right;font-weight:600;color:#334155;font-size:12px;">Qty / Price</th>
      </tr>`
    : `<tr style="background:#f8fafc;">
        <th style="padding:10px 12px;text-align:left;font-weight:600;color:#334155;font-size:12px;">Item</th>
        <th style="padding:10px 12px;text-align:right;font-weight:600;color:#334155;font-size:12px;">Qty / Price</th>
      </tr>`;

  // Rebuild item rows with correct column count
  const itemRowsFinal = (order.line_items ?? []).map((item) => {
    const lineTotal = (item.price ?? 0) * (item.quantity ?? 0);
    const imgCell = hasImages
      ? `<td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;vertical-align:top;width:64px;">
          ${item.image ? `<img src="${escapeHtml(item.image)}" alt="" width="56" height="56" style="display:block;border-radius:8px;object-fit:cover;max-width:56px;height:56px;" />` : ""}
        </td>`
      : "";
    const nameCell = `<td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;vertical-align:top;">
      <span style="font-weight:600;color:#0f172a;font-size:14px;">${escapeHtml(item.name ?? "Item")}</span>
      ${item.size || item.color ? `<br/><span style="font-size:12px;color:#64748b;">${[item.size, item.color].filter(Boolean).join(" · ")}</span>` : ""}
    </td>`;
    const detailsCell = `<td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;vertical-align:top;text-align:right;white-space:nowrap;">
      <span style="font-size:13px;color:#64748b;">Qty: ${item.quantity ?? 0}</span><br/>
      <span style="font-size:13px;">$${(item.price ?? 0).toFixed(2)} each</span><br/>
      <strong style="font-size:14px;color:#0f172a;">$${lineTotal.toFixed(2)}</strong>
    </td>`;
    return `<tr>${imgCell}${nameCell}${detailsCell}</tr>`;
  }).join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Order Confirmation - ${escapeHtml(order.id)}</title>
  <style>
    @media only screen and (max-width: 480px) {
      .email-wrap { padding: 12px !important; }
      .email-body { padding: 16px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .product-table { font-size: 13px !important; }
      .product-table td, .product-table th { padding: 8px 10px !important; }
    }
  </style>
</head>
<body style="margin:0;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#f1f5f9;padding:16px;">
  <div class="email-wrap" style="max-width:100%;width:100%;box-sizing:border-box;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#BF0637 0%,#8b0428 100%);padding:28px 20px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Order Confirmed</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:13px;">Thank you for your purchase</p>
      <p style="margin:16px 0 0;color:#fff;font-size:24px;font-weight:800;letter-spacing:2px;">${escapeHtml(order.id)}</p>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:12px;">${date}</p>
    </div>
    <div class="email-body" style="padding:24px 20px;">
      <p style="margin:0 0 16px;color:#475569;font-size:14px;">Hi${ship.firstName ? ` ${escapeHtml(String(ship.firstName))}` : ""}, your order has been placed successfully.</p>

      <table class="product-table" role="presentation" style="width:100%;max-width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px;table-layout:fixed;">
        <thead>
          ${thead}
        </thead>
        <tbody>
          ${itemRowsFinal}
        </tbody>
      </table>

      <div style="border-top:2px solid #e2e8f0;padding-top:14px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;">
          <span style="color:#64748b;">Subtotal</span>
          <span style="font-weight:600;">$${subtotal.toFixed(2)} ${currency}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;">
          <span style="color:#64748b;">Shipping</span>
          <span style="font-weight:600;">$${shippingAmount.toFixed(2)} ${currency}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:17px;font-weight:700;color:#0f172a;margin-top:10px;padding-top:10px;border-top:1px solid #e2e8f0;">
          <span>Total paid</span>
          <span style="color:#BF0637;">$${total.toFixed(2)} ${currency}</span>
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <div style="background:#f8fafc;border-radius:12px;padding:14px;margin-bottom:10px;">
          <h3 style="margin:0 0 8px;font-size:12px;font-weight:600;color:#BF0637;text-transform:uppercase;letter-spacing:0.5px;">Shipping address</h3>
          <div style="font-size:13px;color:#475569;line-height:1.5;">${formatAddress(order.shipping_address)}</div>
        </div>
        <div style="background:#f8fafc;border-radius:12px;padding:14px;">
          <h3 style="margin:0 0 8px;font-size:12px;font-weight:600;color:#BF0637;text-transform:uppercase;letter-spacing:0.5px;">Billing address</h3>
          <div style="font-size:13px;color:#475569;line-height:1.5;">${order.billing_same_as_shipping ? "Same as shipping" : formatAddress(bill)}</div>
        </div>
      </div>

      <p style="margin:0;font-size:13px;color:#64748b;text-align:center;">Payment status: <strong style="color:#16a34a;">${escapeHtml(order.payment_status ?? "paid")}</strong></p>

      <div style="margin-top:24px;padding:16px;background:#f0f9ff;border-radius:12px;border:1px solid #bae6fd;">
        <p style="margin:0 0 12px;font-size:14px;color:#0c4a6e;line-height:1.5;">Use the same email to log in to the R3sults portal to view more information about your order.</p>
        <p style="margin:0;font-size:13px;"><a href="${escapeHtml(portalUrl)}" style="display:inline-block;padding:10px 20px;background:#BF0637;color:#fff !important;text-decoration:none;font-weight:600;border-radius:8px;">Go to R3sults portal</a></p>
      </div>
    </div>
    <div style="background:#f8fafc;padding:20px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0;font-size:13px;color:#64748b;">Questions? Reply to this email or contact our support.</p>
      <p style="margin:10px 0 0;font-size:12px;color:#94a3b8;">Thank you for shopping with us.</p>
    </div>
  </div>
  </div>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(order: OrderDocument): Promise<void> {
  const user = process.env.EMAIL_ID;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    console.warn("Order confirmation email skipped: EMAIL_ID or EMAIL_PASS not set");
    return;
  }
  const to = order.customer_email?.trim();
  if (!to || !to.includes("@")) {
    console.warn("Order confirmation email skipped: no valid customer_email");
    return;
  }

  const shippingAmount = order.shipping_amount ?? 0;
  const total = order.amount_total ?? 0;
  const portalUrl = getPortalUrl();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"R3sults" <${user}>`,
    to,
    subject: `Order Confirmed - ${order.id}`,
    html: buildOrderConfirmationHtml(order),
    text: `Order ${order.id} confirmed. Subtotal + Shipping: $${total.toFixed(2)}. Thank you for your purchase.\n\nUse the same email to log in to the R3sults portal to view more information about your order: ${portalUrl}`,
  });
}
