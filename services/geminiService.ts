
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { PortfolioData } from '../types';

let chatSession: Chat | null = null;
let currentInstructionChecksum: string = "";

const GEMINI_REQUEST_TIMEOUT_MS = 30000;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

const getGeminiErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message === 'Gemini request timed out.') {
    return "The AI service took too long to respond. Please try again in a moment.";
  }

  const status = (error as any)?.status ?? (error as any)?.code;
  const detail = (error as any)?.message || '';

  switch (status) {
    case 400:
      return "Something went wrong with the request (400 Bad Request). Please rephrase and try again.";
    case 401:
      return "The AI service is not properly configured (401 Unauthorized). Please check the API key.";
    case 403:
      return "Access to the AI service is restricted (403 Forbidden). The API key may lack permissions or billing is not enabled.";
    case 404:
      return "The requested AI model could not be found (404 Not Found). Please check the configuration.";
    case 429:
      return "The AI service is currently receiving too many requests (429 Rate Limit). Please wait a minute and try again.";
    case 500:
    case 502:
    case 503:
      return "The AI service is temporarily unavailable. Please try again shortly.";
    default:
      if (detail) {
        const truncated = detail.length > 120 ? detail.slice(0, 120) + '…' : detail;
        return `Something went wrong: ${truncated}`;
      }
      return "I hit a technical snag. Please try asking again.";
  }
};
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

const getClient = () => {
  const apiKey = (process as any).env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing from environment. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

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
  const client = getClient();
  if (!client) return null;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Parse the following resume markdown into a JSON object matching this schema. Focus on extracting the Projects, Hero Title, Hero Subtitle, and Contact info.
      
      Resume Content:
      ${markdown}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            heroTitle: { type: Type.STRING },
            heroSubtitle: { type: Type.STRING },
            email: { type: Type.STRING },
            linkedinUrl: { type: Type.STRING },
            location: { type: Type.STRING },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  longDescription: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  imageUrl: { type: Type.STRING },
                  githubUrl: { type: Type.STRING },
                  features: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse((response as any).text || '{}');
  } catch (error) {
    console.error("Failed to parse resume markdown:", error, getGeminiErrorMessage(error));
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

const tools = [
  {
    functionDeclarations: [
      {
        name: "delegate_to_owner",
        description: "Sends a question to Ruiping Wang via email when the AI cannot answer it. Requires a summary of the context.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            user_email: {
              type: Type.STRING,
              description: "The email address of the user who is asking the question."
            },
            user_name: {
              type: Type.STRING,
              description: "The name of the user. Infer it from the email address when reasonable; otherwise use 'a visitor'."
            },
            question: {
              type: Type.STRING,
              description: "The specific question to be forwarded."
            },
            conversation_summary: {
              type: Type.STRING,
              description: "A concise summary of the conversation context leading to this delegation."
            }
          },
          required: ["user_email", "question", "conversation_summary"]
        }
      }
    ]
  }
];

export const initializeChat = async (systemInstruction: string) => {
  if (chatSession && currentInstructionChecksum === systemInstruction) {
    return chatSession;
  }

  const client = getClient();
  if (!client) return null;

  try {
    chatSession = (client as any).chats.create({
      model: 'gemini-2.5-flash-lite',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
        tools: tools as any,
      },
    });

    currentInstructionChecksum = systemInstruction;
    return chatSession;
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    return null;
  }
};

export const sendMessageToGemini = async (message: string, systemInstruction: string): Promise<any> => {
  const client = getClient();
  if (!client) return { text: "Please connect an API key to chat!" };

  if (!chatSession || currentInstructionChecksum !== systemInstruction) {
    await initializeChat(systemInstruction);
  }

  if (!chatSession) {
    return { text: "The assistant is initializing. One moment please." };
  }

  try {
    const response = await withTimeout(
      chatSession.sendMessage({ message: addInferredNameContext(message) }),
      GEMINI_REQUEST_TIMEOUT_MS,
      "Gemini request timed out."
    );
    const functionCalls = (response as any).functionCalls || [];

    if (functionCalls && functionCalls.length > 0) {
      return {
        functionCall: functionCalls[0],
        text: "One moment, I'm preparing your message for Ruiping..."
      };
    }

    return { text: (response as any).text };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: getGeminiErrorMessage(error) };
  }
};

export const sendToolResponse = async (callId: string, result: any): Promise<any> => {
  if (!chatSession) return { text: "Could not complete the process. Please try again." };

  try {
    const response = await withTimeout(
      (chatSession as any).sendMessage({
        message: {
          role: 'tool',
          parts: [{
            functionResponse: {
              name: 'delegate_to_owner',
              response: result
            }
          }]
        }
      }),
      GEMINI_REQUEST_TIMEOUT_MS,
      "Gemini tool response timed out."
    );

    return { text: (response as any).text };
  } catch (error) {
    console.error("Tool Response Error:", error);
    const errorDetail = getGeminiErrorMessage(error);
    return { text: `I sent the email, but had trouble confirming it. (${errorDetail}) Rest assured, Ruiping has received your message!` };
  }
};
