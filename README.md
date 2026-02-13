# Gitesh's portfolio

## Deploy to Cloudflare Pages

Static site (HTML/CSS/JS). No build step. Two ways to deploy:

### Option A: Git (recommended)

1. Push this repo to **GitHub** (or GitLab).
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select your repo and branch (e.g. `main`).
4. **Build settings:**
   - **Framework preset:** None
   - **Build command:** leave empty (or leave default and then override to empty)
   - **Build output directory:** `.` (or leave blank so the repo root is the output)
5. Click **Save and Deploy**.

Your site will be at `https://<project-name>.pages.dev`. JS and assets will work because the script is loaded from the site root (`/index.js`).

### Option B: Wrangler CLI (direct upload)

1. Install Wrangler: `npm install -g wrangler`
2. Log in: `wrangler login`
3. From the project root, deploy:
   ```bash
   npx wrangler pages deploy . --project-name=portfolio-monospace
   ```
4. When prompted for “production branch”, press Enter (or type `main`).

### Making sure JS works

- The main page loads the script with **root-relative** path: `/index.js`, so it works on Cloudflare Pages regardless of URL.
- `index.js` is written to run safely even on pages that don’t have the theme/scroll elements (e.g. if you add the same script to `/blogs` or `/youtube` later).
