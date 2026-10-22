import { PortfolioData } from '../types';

let clientHistory: any[] = [];
let currentInstructionChecksum: string = '';

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

const GENERIC_EMAIL_PARTS = new Set([
  'admin',
  'career',
  'contact',
  'hello',
  'hi',
  'hr',
  'info',
  'jobs',
  'mail',
  'me',
  'noreply',
  'no',
  'reply',
  'support',
  'team',
  'user',
  'visitor',
]);

const toDisplayName = (value: string): string => {
  return value
    .split(/[\s._+-]+/)
    .map(part => part.trim())
    .filter(part => part && !GENERIC_EMAIL_PARTS.has(part.toLowerCase()))
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

const inferNameFromEmail = (message: string): string | null => {
  const email = message.match(EMAIL_PATTERN)?.[0];
  if (!email) return null;

  const localPart = email.split('@')[0];
  const withoutTag = localPart.split('+')[0];
  const cleaned = withoutTag
    .replace(/\d+/g, ' ')
    .replace(/[^a-zA-Z._+-]+/g, ' ');

  const inferredName = toDisplayName(cleaned);
  return inferredName || null;
};

const addInferredNameContext = (message: string): string => {
  const inferredName = inferNameFromEmail(message);
  if (!inferredName) return message;

  return `${message}

[Assistant context: The user's email appears to contain the name "${inferredName}". If the user has provided enough information to delegate, use this as the user's name and do not ask for their name again.]`;
};

export const parseResumeMarkdown = async (markdown: string): Promise<Partial<PortfolioData> | null> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'parseResume',
        markdown,
      }),
    });

    if (!response.ok) {
      console.warn('Failed to parse resume via /api/chat:', response.status);
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Failed to parse resume markdown:', error);
    return null;
  }
};

export const generateSystemInstruction = (data: PortfolioData): string => {
  return `
You are the Career AI Assistant for Ruiping Wang, a highly experienced System Architect specializing in automotive security and secure connectivity (UWB, BLE, NFC).

CONTEXT:
Ruiping is currently job hunting for senior roles in Systems Engineering, Architecture, or Technical Leadership.

KNOWLEDGE BASE:
${JSON.stringify(data, null, 2)}

YOUR MANDATE:
1. Act as a professional advocate for Ruiping. 
2. Be extremely knowledgeable about the "CarKeyDemo" project. Explain its technical depth: Swift implementation, BLE/NFC handshake, and digital key standards.
3. Highlight her experience across Tier-1 automotive suppliers (Continental) and high-tech companies (Dyson).
4. Emphasize her expertise in MBSE (Model-Based Systems Engineering), UML, and SysML.
5. If someone asks "Why should I hire Ruiping?", point to her unique blend of test automation roots (Python, C++) and architectural vision.

CONVERSATIONAL RULES:
1. Decline to answer personal questions (marriage, kids, home address). Remind user to ask career-related questions.
2. If you are UNABLE to answer a career-related question based on the KNOWLEDGE BASE:
   a. Explain that you don't have that specific detail.
   b. ASK THE USER if they would like to leave their contact details so you can forward the question to Ruiping.
   c. Summarize the conversation context so far in your mind.
   d. ONLY if the user provides an email AND confirms they want to delegate, you MUST call the "delegate_to_owner" tool, providing the email, question, a concise summary, and the user's name when known.
   e. If the user's name can be reasonably inferred from the email address or previous messages, use that inferred name. Do not ask "what name should I use" when a reasonable name is already available.
   f. If no name is provided or inferable, use "a visitor" for the name instead of asking another follow-up solely for the name.

TONE:
Professional, confident, technical, and helpful. Use Markdown for structured responses.
`;
};

export const initializeChat = async (systemInstruction: string) => {
  if (currentInstructionChecksum !== systemInstruction) {
    clientHistory = [];
    currentInstructionChecksum = systemInstruction;
  }
  return true;
};

export const resetChatSession = () => {
  clientHistory = [];
  currentInstructionChecksum = '';
};

export const sendMessageToGemini = async (message: string, systemInstruction: string): Promise<any> => {
  if (currentInstructionChecksum !== systemInstruction) {
    clientHistory = [];
    currentInstructionChecksum = systemInstruction;
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'chat',
        message: addInferredNameContext(message),
        history: clientHistory,
        systemInstruction,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 503 || data?.disabled) {
        return { text: 'Please connect an API key to chat!' };
      }
      return { text: data?.error || data?.text || 'The AI service encountered an issue. Please try again in a moment.' };
    }

    if (Array.isArray(data?.history)) {
      clientHistory = data.history;
    }

    if (data?.functionCall) {
      return {
        functionCall: data.functionCall,
        text: data.text || "One moment, I'm preparing your message for Ruiping...",
      };
    }

    return { text: data?.text || "I couldn't generate a response just now. Please try again in a moment." };
  } catch (error) {
    console.error('Chat request failed:', error);
    return { text: 'I hit a technical snag connecting to the assistant. Please try again shortly.' };
  }
};

export const sendToolResponse = async (_callId: string, result: any): Promise<any> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'toolResponse',
        toolResponse: result,
        history: clientHistory,
        systemInstruction: currentInstructionChecksum,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        text: `I sent the message, but had trouble confirming it. Rest assured, Ruiping has received your message!`,
      };
    }

    if (Array.isArray(data?.history)) {
      clientHistory = data.history;
    }

    return { text: data?.text || 'Ruiping has been notified and can reply by email.' };
  } catch (error) {
    console.error('Tool Response Error:', error);
    return {
      text: `I sent the message, but had trouble confirming it. Rest assured, Ruiping has received your message!`,
    };
  }
};
