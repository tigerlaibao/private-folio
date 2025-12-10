# PrivateFolio

A privacy-focused, self-hosted personal finance tracker.
**BYOC (Bring Your Own Cloud)** + **E2EE (End-to-End Encryption)**

## 🚀 One-Click Deployment

Deploy your own instance of PrivateFolio to your Cloudflare account for free.

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/tigerlaibao/private-folio)

*Note: Please replace `tigerlaibao` in the URL above with your actual GitHub username if you fork this.*

## How it Works
1. **Fork** this repository.
2. Click the **Deploy** button above.
3. Follow the Cloudflare prompts to connect your GitHub account.
4. Cloudflare will automatically:
   - Create a D1 Database (`portfolio-db`).
   - Build and deploy the Next.js frontend.

## Features
- **Zero Knowledge**: Data is encrypted in your browser before being sent.
- **Serverless**: Runs entirely on Cloudflare Pages & D1.
- **Free**: Fits well within Cloudflare's free tier.

## Local Development

```bash
npm install
npm run preview # To run with Wrangler (simulating D1)
# or
npm run dev     # Standard Next.js dev server
```
