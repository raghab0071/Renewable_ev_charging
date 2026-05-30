# Vercel Environment Setup

This guide shows how to set environment variables on Vercel to fix the "supabaseUrl is required" error and enable all third-party API integrations.

## Steps

### 1. Go to Vercel Dashboard
- Navigate to [https://vercel.com/dashboard](https://vercel.com/dashboard)
- Click on your project: **renewable-ev-charging**

### 2. Open Settings → Environment Variables
- In the project sidebar, click **Settings**
- Select **Environment Variables** from the left menu

### 3. Add Each Variable
For each variable below, click **Add New** and fill in the **Name** and **Value**, then select "Production" or "Production, Preview, Development":

```
VITE_SUPABASE_URL
Value: https://nrhggzxgimudimfraniz.supabase.co

VITE_SUPABASE_PUBLISHABLE_KEY
Value: sb_publishable_eE1MiVOOZD0nFN98zPP4KQ_9HOv2bvy

VITE_SUPABASE_ANON_KEY
Value: anon_XXXXXXXXXXXXXXXXXXX (your actual anon key from Supabase)

VITE_GOOGLE_ANALYTICS_ID
Value: G-XXXXXXXXXX (your Google Analytics Measurement ID)

VITE_ADSENSE_ID
Value: ca-pub-XXXXXXXXXX (your AdSense publisher ID, if using ads)

VITE_STRIPE_PUBLISHABLE_KEY
Value: pk_test_XXXXXXXXXX or pk_live_XXXXXXXXXX (if using Stripe)
```

### 4. Save & Redeploy
1. Click **Save** after adding all variables
2. Go to **Deployments** tab
3. Find the latest deployment → Click the **...** menu → Select **Redeploy**
4. Wait for the deployment to complete (5-10 minutes)

### 5. Test
- Visit [https://renewable-ev-charging.vercel.app](https://renewable-ev-charging.vercel.app)
- Open browser DevTools (F12) → Console
- You should **not** see "supabaseUrl is required" anymore
- CORS errors from `rocket.new` tracking should also be gone (tracking script was removed)

## Notes

- **Do NOT commit** the `.env` file to your repository
- Environment variables on Vercel will override `.env` on your local machine
- For secret keys (OpenAI, Anthropic, etc.), consider using the proxy server at `server/openai-proxy.js` — store those secrets in Vercel as non-`VITE_` variables instead

## If Something Still Goes Wrong

- Clear browser cache: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
- Force refresh Vercel deployment by clicking Redeploy again
- Check if the Vercel build logs have errors: **Deployments** → **Building** section
