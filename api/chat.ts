import { GoogleGenAI, Type } from '@google/genai';

const GEMINI_REQUEST_TIMEOUT_MS = 25000;

interface ChatRequestBody {
  action?: 'chat' | 'toolResponse' | 'parseResume';
  message?: string;
  history?: any[];
  systemInstruction?: string;
  toolResponse?: any;
  toolName?: string;
  markdown?: string;
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

const tools = [
  {
    functionDeclarations: [
      {
        name: 'delegate_to_owner',
        description: 'Sends a question to Ruiping Wang via email when the AI cannot answer it. Requires a summary of the context.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            user_email: {
              type: Type.STRING,
              description: 'The email address of the user who is asking the question.',
            },
            user_name: {
              type: Type.STRING,
              description: "The name of the user. Infer it from the email address when reasonable; otherwise use 'a visitor'.",
            },
            question: {
              type: Type.STRING,
              description: 'The specific question to be forwarded.',
            },
            conversation_summary: {
              type: Type.STRING,
              description: 'A concise summary of the conversation context leading to this delegation.',
            },
          },
          required: ['user_email', 'question', 'conversation_summary'],
        },
      },
    ],
  },
];

const getGeminiErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message === 'Gemini request timed out.') {
    return 'The AI service took too long to respond. Please try again in a moment.';
  }

  const status = (error as any)?.status ?? (error as any)?.code;
  const detail = (error as any)?.message || '';

  switch (status) {
    case 400:
      return 'Something went wrong with the request (400 Bad Request). Please rephrase and try again.';
    case 401:
      return 'The AI service is not properly configured (401 Unauthorized). Please check the server API key.';
    case 403:
      return 'Access to the AI service is restricted (403 Forbidden). The API key may lack permissions or billing is not enabled.';
    case 404:
      return 'The requested AI model could not be found (404 Not Found). Please check the configuration.';
    case 429:
      return 'The AI service is currently receiving too many requests (429 Rate Limit). Please wait a minute and try again.';
    case 500:
    case 502:
    case 503:
      return 'The AI service is temporarily unavailable. Please try again shortly.';
    default:
      if (detail) {
        const truncated = detail.length > 120 ? detail.slice(0, 120) + '…' : detail;
        return `Something went wrong: ${truncated}`;
      }
      return 'I hit a technical snag. Please try asking again.';
  }
};

const handleChatRequest = async (request: Request): Promise<Response> => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  if (!apiKey) {
    return json(
      {
        error: 'API_KEY is missing from server environment. AI features are disabled.',
        disabled: true,
      },
      { status: 503 },
    );
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }

  const client = new GoogleGenAI({ apiKey });
  const action = body.action || (body.toolResponse ? 'toolResponse' : 'chat');

  try {
    if (action === 'parseResume') {
      const markdown = body.markdown || '';
      if (!markdown) {
        return json({ error: 'Markdown content is required.' }, { status: 400 });
      }

      const response = await withTimeout(
        client.models.generateContent({
          model,
          contents: `Parse the following resume markdown into a JSON object matching this schema. Focus on extracting the Projects, Hero Title, Hero Subtitle, and Contact info.
      
      Resume Content:
      ${markdown}`,
          config: {
            responseMimeType: 'application/json',
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
                      features: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                  },
                },
              },
            },
          },
        }),
        GEMINI_REQUEST_TIMEOUT_MS,
        'Gemini request timed out.',
      );

      const parsed = JSON.parse((response as any).text || '{}');
      return json({ data: parsed });
    }

    if (action === 'toolResponse') {
      const { toolResponse, toolName = 'delegate_to_owner', history = [], systemInstruction } = body;
      const chat = client.chats.create({
        model,
        history: Array.isArray(history) && history.length > 0 ? history : undefined,
        config: {
          systemInstruction: systemInstruction || undefined,
          temperature: 0.5,
          tools: tools as any,
        },
      });

      const response = await withTimeout(
        chat.sendMessage({
          message: {
            role: 'tool',
            parts: [
              {
                functionResponse: {
                  name: toolName,
                  response: toolResponse,
                },
              },
            ],
          } as any,
        }),
        GEMINI_REQUEST_TIMEOUT_MS,
        'Gemini request timed out.',
      );

      const updatedHistory = await chat.getHistory();
      return json({
        text: (response as any).text,
        history: updatedHistory,
      });
    }

    // Default action: 'chat'
    const { message = '', history = [], systemInstruction } = body;
    if (!message) {
      return json({ error: 'Message is required.' }, { status: 400 });
    }

    const chat = client.chats.create({
      model,
      history: Array.isArray(history) && history.length > 0 ? history : undefined,
      config: {
        systemInstruction: systemInstruction || undefined,
        temperature: 0.5,
        tools: tools as any,
      },
    });

    const response = await withTimeout(
      chat.sendMessage({ message }),
      GEMINI_REQUEST_TIMEOUT_MS,
      'Gemini request timed out.',
    );

    const functionCalls = (response as any).functionCalls || [];
    const updatedHistory = await chat.getHistory();

    if (functionCalls && functionCalls.length > 0) {
      return json({
        functionCall: functionCalls[0],
        text: "One moment, I'm preparing your message for Ruiping...",
        history: updatedHistory,
      });
    }

    return json({
      text: (response as any).text,
      history: updatedHistory,
    });
  } catch (error) {
    console.error('Gemini API Error in /api/chat:', error);
    const friendlyMessage = getGeminiErrorMessage(error);
    return json({ error: friendlyMessage, text: friendlyMessage }, { status: 500 });
  }
};

export default {
  fetch: handleChatRequest,
};

export { handleChatRequest as POST };
