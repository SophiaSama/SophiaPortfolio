import nodemailer from 'nodemailer';

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

interface EmailConfig {
  user: string;
  pass: string;
  to: string;
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
  return truncate(
    [
      `Name: ${senderName}`,
      `Email: ${senderEmail}`,
      '',
      'Question:',
      question,
      '',
      'Conversation summary:',
      summary || 'No summary provided.',
    ].join('\n'),
    PUSHOVER_MESSAGE_LIMIT,
  );
};

const formatEmailMessage = ({
  senderEmail,
  senderName,
  question,
  summary,
}: Required<ContactRequestBody>): { subject: string; text: string; html: string } => {
  const subject = `New Career Inquiry from ${senderName}`;
  const text = [
    `Name: ${senderName}`,
    `Email: ${senderEmail}`,
    '',
    'Question:',
    question,
    '',
    'Conversation summary:',
    summary || 'No summary provided.',
    '',
    '---',
    `Reply directly to this email or use: mailto:${senderEmail}`,
  ].join('\n');

  const html = [
    '<div style="font-family: system-ui, sans-serif; max-width: 600px;">',
    `<h2 style="color: #1e293b;">New Career Inquiry</h2>`,
    `<p><strong>Name:</strong> ${senderName}</p>`,
    `<p><strong>Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></p>`,
    '<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;">',
    '<h3 style="color: #334155;">Question</h3>',
    `<p style="white-space: pre-wrap; background: #f8fafc; padding: 12px; border-radius: 6px;">${question}</p>`,
    '<h3 style="color: #334155;">Conversation Summary</h3>',
    `<p style="white-space: pre-wrap; background: #f8fafc; padding: 12px; border-radius: 6px;">${summary || 'No summary provided.'}</p>`,
    '<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;">',
    `<p style="color: #64748b; font-size: 14px;">Reply directly to this email or click: <a href="mailto:${senderEmail}">${senderEmail}</a></p>`,
    '</div>',
  ].join('\n');

  return { subject, text, html };
};

const sendPushover = async (
  pushoverUserKey: string,
  pushoverApiToken: string,
  title: string,
  message: string,
  senderEmail: string,
): Promise<{ success: boolean; error?: string; id?: string }> => {
  try {
    const pushoverBody = new URLSearchParams({
      token: pushoverApiToken,
      user: pushoverUserKey,
      title: truncate(title, 250),
      message,
      url: `mailto:${senderEmail}`,
      url_title: 'Reply by email',
    });

    const response = await fetch(PUSHOVER_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: pushoverBody,
    });

    const result = (await response.json()) as PushoverResponseBody;

    if (!response.ok || result.status !== 1) {
      const errorMsg = result.errors?.join(' ') || response.statusText;
      return { success: false, error: `Pushover error: ${errorMsg}` };
    }

    return { success: true, id: result.request };
  } catch (error) {
    console.error('Pushover send failed:', error);
    return { success: false, error: 'Pushover request failed' };
  }
};

const sendEmail = async (
  config: EmailConfig,
  { subject, text, html }: { subject: string; text: string; html: string },
): Promise<{ success: boolean; error?: string }> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    await transporter.sendMail({
      from: config.user,
      to: config.to,
      subject,
      text,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error('Email send failed:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown email error';
    return { success: false, error: `Email error: ${errorMsg}` };
  }
};

export default {
  async fetch(request: Request): Promise<Response> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, { status: 405 });
    }

    // Load environment variables
    const pushoverUserKey = process.env.PUSHOVER_USER_KEY;
    const pushoverApiToken = process.env.PUSHOVER_API_TOKEN;
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPass = process.env.GMAIL_APP_PASS;
    const contactToEmail = process.env.CONTACT_TO_EMAIL;

    const hasPushover = pushoverUserKey && pushoverApiToken;
    const hasEmail = gmailUser && gmailAppPass && contactToEmail;

    if (!hasPushover && !hasEmail) {
      return json(
        { error: 'Notification service is not configured (no Pushover or Email credentials).' },
        { status: 500 },
      );
    }

    // Parse request body
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
    const pushoverMessage = formatPushoverMessage({ senderEmail, senderName, question, summary });
    const emailContent = formatEmailMessage({ senderEmail, senderName, question, summary });

    let pushoverResult: { success: boolean; error?: string; id?: string } = { success: false, error: 'Not attempted' };
    let emailResult: { success: boolean; error?: string } = { success: false, error: 'Not attempted' };

    // Try Pushover first
    if (hasPushover) {
      pushoverResult = await sendPushover(pushoverUserKey!, pushoverApiToken!, title, pushoverMessage, senderEmail);
    }

    // Fallback to email if Pushover failed or not configured
    if (!pushoverResult.success && hasEmail) {
      emailResult = await sendEmail(
        { user: gmailUser!, pass: gmailAppPass!, to: contactToEmail! },
        emailContent,
      );
    }

    // Determine overall success
    const success = pushoverResult.success || emailResult.success;
    const details: string[] = [];

    if (pushoverResult.success) details.push('Pushover notification sent');
    else if (hasPushover) details.push(`Pushover failed: ${pushoverResult.error}`);

    if (emailResult.success) details.push('Email notification sent');
    else if (hasEmail) details.push(`Email failed: ${emailResult.error}`);

    if (!success) {
      return json(
        { error: 'All notification methods failed.', details },
        { status: 502 },
      );
    }

    return json({ success: true, details });
  },
};