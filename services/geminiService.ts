
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { PortfolioData } from '../types';

let chatSession: Chat | null = null;
let currentInstructionChecksum: string = "";

const getClient = () => {
  const apiKey = (process as any).env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing from environment. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
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
    console.error("Failed to parse resume markdown:", error);
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
   b. ASK THE USER if they would like to leave their name and email address so you can forward the question to Ruiping.
   c. Summarize the conversation context so far in your mind.
   d. ONLY if the user provides an email AND confirms they want to delegate, you MUST call the "delegate_to_owner" tool, providing the email, name, question, and a concise summary.

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
              description: "The name of the user (if provided, else 'a visitor')."
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
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
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
  if (!client) return { text: "I'm currently resting. Please connect an API key to chat!" };

  if (!chatSession || currentInstructionChecksum !== systemInstruction) {
    await initializeChat(systemInstruction);
  }

  if (!chatSession) {
    return { text: "The assistant is initializing. One moment please." };
  }

  try {
    const response = await chatSession.sendMessage({ message });
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
    return { text: "I hit a technical snag. Please try asking again." };
  }
};

export const sendToolResponse = async (callId: string, result: any): Promise<any> => {
  if (!chatSession) return { text: "Could not complete the process. Please try again." };

  try {
    const response = await (chatSession as any).sendMessage({
      message: {
        role: 'tool',
        parts: [{
          functionResponse: {
            name: 'delegate_to_owner',
            response: result
          }
        }]
      }
    });

    return { text: (response as any).text };
  } catch (error) {
    console.error("Tool Response Error:", error);
    return { text: "I sent the email, but had trouble confirming it. Rest assured, Ruiping has received your message!" };
  }
};
