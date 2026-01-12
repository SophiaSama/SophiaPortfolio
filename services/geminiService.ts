
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
      model: "gemini-3-flash-preview",
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

    return JSON.parse(response.text || '{}');
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

TONE:
Professional, confident, technical, and helpful. Use Markdown for structured responses.
`;
};

export const initializeChat = async (systemInstruction: string) => {
  if (chatSession && currentInstructionChecksum === systemInstruction) {
    return chatSession;
  }

  const client = getClient();
  if (!client) return null;

  try {
    chatSession = client.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });
    currentInstructionChecksum = systemInstruction;
    return chatSession;
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    return null;
  }
};

export const sendMessageToGemini = async (message: string, systemInstruction: string): Promise<string> => {
  const client = getClient();
  if (!client) return "I'm currently resting. Please connect an API key to chat!";

  if (!chatSession || currentInstructionChecksum !== systemInstruction) {
    await initializeChat(systemInstruction);
  }

  if (!chatSession) {
    return "The assistant is initializing. One moment please.";
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I hit a technical snag. Please try asking again.";
  }
};
