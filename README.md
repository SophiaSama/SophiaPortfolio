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

## Email Handoff

The chat delegation flow sends email through a Vercel Serverless Function at `/api/contact` using Nodemailer with Gmail SMTP.

Required Vercel environment variables:

- `GMAIL_USER` — your Gmail address
- `GMAIL_APP_PASS` — a [Google App Password](https://myaccount.google.com/apppasswords) (requires 2-Step Verification)
- `CONTACT_TO_EMAIL`

The plain Vite dev server does not run Vercel functions locally; use Vercel deployment or `vercel dev` when testing the email API end to end.
