## My Live Resume
My resume presented as a web App, viewers can scroll my experience, check the linked side projects, chat with my career agent(as long as my Gemini API spend is still within its montly budget), and also export my CV as PDF.

## Contact Notification Handoff
My career agent will delegate a message to me if someone showed interest to interact further and directly connect to me.

The chat delegation flow sends a push notification through a Vercel Serverless Function at `/api/contact` using [Pushover](https://pushover.net/). The visitor's email address is included in the notification and attached as a `mailto:` reply link.

Required Vercel environment variables:

- `PUSHOVER_USER_KEY` — your Pushover user key
- `PUSHOVER_API_TOKEN` — the API token for your Pushover application

The plain Vite dev server does not run Vercel functions locally; use Vercel deployment or `vercel dev` when testing the contact notification API end to end.
