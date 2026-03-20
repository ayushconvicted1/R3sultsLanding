# Google address autocomplete (merch checkout)

Merch checkout can suggest addresses as you type **when you add a Maps API key**.

## What you need from Google Cloud Console

1. **Google Cloud project** (or create one): [console.cloud.google.com](https://console.cloud.google.com/)

2. **Enable billing** on the project (Google requires this for Maps/Places, even with free tier).

3. **Enable these APIs** (APIs & Services → Library):
   - **Maps JavaScript API**
   - **Places API** (the classic “Places API”, not only “Places API (New)” — enabling both is fine)

4. **Create an API key** (APIs & Services → Credentials → Create credentials → API key).

5. **Restrict the key** (recommended):
   - **Application restrictions**: HTTP referrers  
   - Add your domains, e.g. `http://localhost:3000/*`, `https://yourdomain.com/*`
   - **API restrictions**: restrict to “Maps JavaScript API” and “Places API”

6. In your app **`.env.local`** add:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

Restart the dev server. The street address field will show Google suggestions.

## Without a key

Checkout still works: customers type the address manually. No key is required.

## Costs

Google bills **Places Autocomplete** per session (see current [Google Maps Platform pricing](https://mapsplatform.google.com/pricing/)). Set budgets/alerts in Cloud Console.
