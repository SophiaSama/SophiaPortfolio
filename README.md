<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: <https://ai.studio/apps/drive/1_Xw7a8XdhUVwmvhnJyZ0A5DCW0M9RwlD>

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Copy [.env.example](.env.example) to `.env.local` and set the required values.
3. Run the app:
   `npm run dev`

## Contact Notification Handoff

The chat delegation flow sends a push notification through a Vercel Serverless Function at `/api/contact` using [Pushover](https://pushover.net/). The visitor's email address is included in the notification and attached as a `mailto:` reply link.

Required Vercel environment variables:

- `PUSHOVER_USER_KEY` — your Pushover user key
- `PUSHOVER_API_TOKEN` — the API token for your Pushover application

The plain Vite dev server does not run Vercel functions locally; use Vercel deployment or `vercel dev` when testing the contact notification API end to end.
