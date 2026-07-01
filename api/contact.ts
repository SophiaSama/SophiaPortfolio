const MAX_FIELD_LENGTH = 4000;
const PUSHOVER_MESSAGE_LIMIT = 1024;
const PUSHOVER_API_URL = 'https://api.pushover.net/1/messages.json';

interface ContactRequestBody {
  senderEmail?: string;
  senderName?: string;
  question?: string;
  summary?: string;
}

interface PushoverResponseBody {
  status?: number;
  request?: string;
  errors?: string[];
}

const json = (body: unknown, init?: ResponseInit) => {
  return Response.json(body, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
};

const cleanField = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD_LENGTH);
};

const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const truncate = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
};

const formatPushoverMessage = ({
  senderEmail,
  senderName,
  question,
  summary,
}: Required<ContactRequestBody>): string => {
  return truncate([
    `Name: ${senderName}`,
    `Email: ${senderEmail}`,
    '',
    'Question:',
    question,
    '',
    'Conversation summary:',
    summary || 'No summary provided.',
  ].join('\n'), PUSHOVER_MESSAGE_LIMIT);
};

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, { status: 405 });
    }

    const pushoverUserKey = process.env.PUSHOVER_USER_KEY;
    const pushoverApiToken = process.env.PUSHOVER_API_TOKEN;

    if (!pushoverUserKey || !pushoverApiToken) {
      return json(
        { error: 'Push notification service is not configured.' },
        { status: 500 }
      );
    }

    let body: ContactRequestBody;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const senderEmail = cleanField(body.senderEmail);
    const senderName = cleanField(body.senderName) || 'a visitor';
    const question = cleanField(body.question);
    const summary = cleanField(body.summary);

    if (!isValidEmail(senderEmail)) {
      return json({ error: 'A valid sender email is required.' }, { status: 400 });
    }

    if (!question) {
      return json({ error: 'Question is required.' }, { status: 400 });
    }

    const title = `New Career Inquiry from ${senderName}`;
    const message = formatPushoverMessage({
      senderEmail,
      senderName,
      question,
      summary,
    });

    try {
      const pushoverBody = new URLSearchParams({
        token: pushoverApiToken,
        user: pushoverUserKey,
        title: truncate(title, 250),
        message,
        url: `mailto:${senderEmail}`,
        url_title: 'Reply by email',
      });

      const pushoverResponse = await fetch(PUSHOVER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: pushoverBody,
      });
      const result = await pushoverResponse.json() as PushoverResponseBody;

      if (!pushoverResponse.ok || result.status !== 1) {
        const providerMessage = result.errors?.join(' ') || pushoverResponse.statusText;
        return json({ error: providerMessage || 'Pushover request failed.' }, { status: 502 });
      }

      return json({ success: true, id: result.request });
    } catch (error) {
      console.error('Pushover send failed:', error);
      return json({ error: 'Push notification provider request failed.' }, { status: 502 });
    }
  },
};
