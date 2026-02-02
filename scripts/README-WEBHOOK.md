# Stripe webhook (orders stored in Google Sheets)

Orders are stored when Stripe sends a `checkout.session.completed` event to the webhook. To capture orders locally:

1. **Install Stripe CLI** (if not already): https://stripe.com/docs/stripe-cli  
   - Windows: `scoop install stripe` or download from GitHub.

2. **Log in**: `stripe login`

3. **Run the webhook listener** in a **separate terminal** (keep it running while testing):
   ```bash
   npm run webhook
   ```
   This runs: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

4. The CLI will print a **webhook signing secret** (e.g. `whsec_...`). Add it to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
   ```

5. **Start the app** in another terminal: `npm run dev`

6. Complete a test checkout. The webhook will receive the event and append the order to the **Orders** sheet in your Google Sheet (same spreadsheet as `GOOGLE_SHEETS_ID`). The sheet is created automatically if it doesn’t exist.

**Production:** In Stripe Dashboard → Developers → Webhooks, add an endpoint for your live URL (e.g. `https://your-site.com/api/webhooks/stripe`) and subscribe to `checkout.session.completed`. Use the endpoint’s signing secret as `STRIPE_WEBHOOK_SECRET` in production env.
