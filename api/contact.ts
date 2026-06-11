import nodemailer from 'nodemailer';

const MAX_FIELD_LENGTH = 4000;

interface ContactRequestBody {
  senderEmail?: string;
  senderName?: string;
  question?: string;
  summary?: string;
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

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, { status: 405 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPass = process.env.GMAIL_APP_PASS;
    const toEmail = process.env.CONTACT_TO_EMAIL;

    if (!gmailUser || !gmailAppPass || !toEmail) {
      return json(
        { error: 'Email service is not configured.' },
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

    const subject = `New Career Inquiry from ${senderName} (${senderEmail})`;
    const text = [
      'NEW INQUIRY',
      '',
      `NAME: ${senderName}`,
      `EMAIL: ${senderEmail}`,
      '',
      'QUESTION:',
      question,
      '',
      'CONVERSATION SUMMARY:',
      summary || 'No summary provided.',
    ].join('\n');

    const html = `
      <h2>New Career Inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(senderName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(senderEmail)}</p>
      <h3>Question</h3>
      <p>${escapeHtml(question).replace(/\n/g, '<br />')}</p>
      <h3>Conversation Summary</h3>
      <p>${escapeHtml(summary || 'No summary provided.').replace(/\n/g, '<br />')}</p>
    `;

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailAppPass,
        },
      });

      const info = await transporter.sendMail({
        from: gmailUser,
        to: toEmail,
        replyTo: senderEmail,
        subject,
        text,
        html,
      });

      return json({ success: true, id: info.messageId });
    } catch (error) {
      console.error('Email send failed:', error);
      return json({ error: 'Email provider request failed.' }, { status: 502 });
    }
  },
};
