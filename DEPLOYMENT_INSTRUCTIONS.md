# 🏗️ Matt's Empire — Deployment Instructions
## How to Get All 4 Sites Live for FREE

---

## THE BIG PICTURE — How This Works

You own the **domain names** (the addresses) through GoDaddy.
You do NOT need to pay GoDaddy to host your sites.
We use **GitHub Pages** — completely FREE hosting — and just tell GoDaddy to point your domains there.

Think of it like this:
- GoDaddy = the street address sign
- GitHub Pages = the actual building
- You own both. GoDaddy just points traffic to the free building.

---

## STEP 1 — Enable GitHub Pages (Do This Once)

1. Go to **github.com** and log into your account
2. Go to the repo: `mattcritchfield026-commits/new-mini-app-quickstart`
3. Click **Settings** (top right of the repo)
4. Scroll down to **Pages** in the left sidebar
5. Under "Source" select **Deploy from a branch**
6. Select branch: `main` and folder: `/ (root)`
7. Click **Save**

GitHub will give you a URL like: `https://mattcritchfield026-commits.github.io/new-mini-app-quickstart/`

Each site will be at:
- `https://mattcritchfield026-commits.github.io/new-mini-app-quickstart/pawcoins/`
- `https://mattcritchfield026-commits.github.io/new-mini-app-quickstart/mccnow/`
- `https://mattcritchfield026-commits.github.io/new-mini-app-quickstart/foyera/`
- `https://mattcritchfield026-commits.github.io/new-mini-app-quickstart/safenest/`

---

## STEP 2 — Point Your GoDaddy Domains to GitHub Pages

### For EACH domain, do the following:

1. Log into **GoDaddy.com**
2. Click your name (top right) → **My Products**
3. Find the domain → Click **DNS** (or "Manage DNS")
4. You'll see a table of DNS records

### DNS Records to Set:

#### pawcoins.us
| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 600 |
| A | @ | 185.199.109.153 | 600 |
| A | @ | 185.199.110.153 | 600 |
| A | @ | 185.199.111.153 | 600 |
| CNAME | www | mattcritchfield026-commits.github.io | 600 |

#### mccnow.net
Same A records as above + CNAME www pointing to `mattcritchfield026-commits.github.io`

#### foyera.online
Same A records as above + CNAME www pointing to `mattcritchfield026-commits.github.io`

#### safenestseniorservices.com
Same A records as above + CNAME www pointing to `mattcritchfield026-commits.github.io`

**The 4 GitHub Pages IP addresses are always:**
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

---

## STEP 3 — Add Custom Domain in GitHub Pages

For each domain, after setting DNS:

1. Go to your GitHub repo → Settings → Pages
2. Under "Custom domain" type your domain (e.g., `pawcoins.us`)
3. Click Save
4. Check "Enforce HTTPS" (gives you the padlock for free)

GitHub will automatically get you a FREE SSL certificate within 24 hours.

---

## STEP 4 — Set Up Google Sheets for Lead Forms (MCCNow, Foyera, SafeNest)

### This takes about 10 minutes and is completely free:

1. Go to **sheets.google.com**
2. Create a new spreadsheet
3. Name it "MCC Bookings" (or "Foyera Leads" or "SafeNest Leads")
4. Click **Extensions** → **Apps Script**
5. Delete all the existing code
6. Copy and paste the code from `mccnow/google-apps-script.js` in this repo
7. Click the **Save** button (floppy disk icon)
8. Click **Deploy** → **New Deployment**
9. Set type to: **Web App**
10. Set "Execute as": **Me**
11. Set "Who has access": **Anyone**
12. Click **Deploy**
13. **COPY THE WEB APP URL** — it looks like `https://script.google.com/macros/s/XXXXX/exec`
14. Open the corresponding site's `index.html` file
15. Find the line that says `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL`
16. Replace it with the URL you just copied
17. Save and push to GitHub

Do this separately for each site (MCCNow, Foyera, SafeNest).

---

## STEP 5 — Set Up Stripe for PawCoins Donations

1. Go to **dashboard.stripe.com** (create free account if you don't have one)
2. Click **Payment Links** in the left sidebar
3. Click **+ New** → **Create a payment link**
4. Set it up as a "Donation" or fixed amount
5. Copy the link (looks like `https://buy.stripe.com/XXXXX`)
6. Open `pawcoins/index.html`
7. Find `YOUR_STRIPE_PAYMENT_LINK` and replace with your link
8. Push to GitHub

---

## STEP 6 — Set Up PayPal for PawCoins

1. Go to **paypal.me** and create your personal PayPal.me link
2. Open `pawcoins/index.html`
3. Find `YOUR_PAYPAL_USERNAME` and replace with your PayPal.me username
4. Push to GitHub

---

## STEP 7 — Set Up Solana Wallet for PawCoins

1. Download **Phantom Wallet** (phantom.app) — it's free
2. Create a wallet and copy your Solana wallet address
3. Open `pawcoins/index.html`
4. Find `YOUR_SOLANA_WALLET_ADDRESS` and replace with your address
5. Push to GitHub

---

## STEP 8 — Fix foyera.online DNS (Currently Broken)

The domain is registered but pointing to Cloudflare with no origin server.

**Option A: Fix in GoDaddy**
1. Log into GoDaddy → DNS for foyera.online
2. Delete any existing Cloudflare nameservers
3. Add the GitHub Pages A records listed in Step 2
4. Wait 24-48 hours for DNS to propagate

**Option B: Keep Cloudflare (Better Performance)**
1. Log into Cloudflare → foyera.online
2. Go to DNS → Add Records
3. Add the 4 GitHub Pages A records
4. Set them to "DNS only" (gray cloud, not orange)
5. This fixes the Error 1001

---

## STEP 9 — Fix safenestseniorservices.com (Currently Parked at IONOS)

The domain appears to be registered/parked at IONOS (German hosting company).

**You need to either:**
1. Log into IONOS and change the nameservers to GoDaddy's nameservers, OR
2. Log into IONOS and add the GitHub Pages A records directly in IONOS DNS, OR
3. Transfer the domain to GoDaddy (takes 5-7 days)

**IONOS nameserver change:**
1. Log into ionos.com (or mein.ionos.de)
2. Go to Domains → safenestseniorservices.com → DNS
3. Add the 4 GitHub Pages A records

---

## WHAT EACH SITE NEEDS FROM YOU (Quick Reference)

| Site | What's Needed From Matt |
|------|------------------------|
| pawcoins.us | Stripe Payment Link URL, PayPal.me username, Solana wallet address |
| mccnow.net | Google Apps Script URL, your phone number in the nav |
| foyera.online | Fix DNS (Cloudflare Error 1001), Google Apps Script URL |
| safenestseniorservices.com | Fix IONOS DNS or transfer domain, Google Apps Script URL |

---

## TIMELINE

| Task | Time to Complete |
|------|-----------------|
| Push code to GitHub | Done (already done) |
| Enable GitHub Pages | 5 minutes |
| Set DNS for each domain | 10 minutes per domain |
| DNS propagation | 24-48 hours |
| Set up Google Sheets scripts | 10 minutes each |
| Set up Stripe/PayPal | 15 minutes |
| SSL certificates (auto) | 24 hours after DNS |

**Total time with your involvement: About 2 hours spread over 2 days (mostly waiting for DNS)**

---

## NEED HELP?

If you get stuck on any step, just tell me exactly where you are and I'll walk you through it step by step. You've got this.

— Built by your business partner 🤝
