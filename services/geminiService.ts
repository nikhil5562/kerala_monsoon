import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { AppSettings } from '../types';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const sendMessageToGemini = async (
  message: string,
  history: { role: 'user' | 'model'; text: string; image?: string }[],
  settings: AppSettings,
  image?: string // Base64 string
) => {
  try {
    const formattedHistory = history.map(h => {
      const parts: any[] = [];
      if (h.image) {
          // Remove prefix if present, though Gemini usually handles raw base64 or specific structure
          // For @google/genai, inlineData expects base64 without the data:image/... prefix
          const base64Data = h.image.split(',')[1] || h.image; 
          parts.push({ 
            inlineData: { 
              mimeType: 'image/jpeg', 
              data: base64Data 
            } 
          });
      }
      if (h.text) {
        parts.push({ text: h.text });
      }
      return {
        role: h.role,
        content: { parts }
      };
    });

    let instruction = SYSTEM_INSTRUCTION;
    
    // Inject Context
    if (settings.simpleLanguage) {
      instruction += "\n\n[OVERRIDE]: The user has requested 'Simple Language'. Explain complex concepts using everyday analogies.";
    }
    
    if (settings.language === 'ml') {
        instruction += "\n\n[OVERRIDE]: The user has selected MALAYALAM language. You MUST respond in Malayalam script.";
    }

    if (settings.location?.district) {
        instruction += `\n\n[CONTEXT]: User is located in District: ${settings.location.district}. Local Area: ${settings.location.localArea || 'Not specified'}. Tailor advice to this geography.`;
    }

    const modelId = 'gemini-2.5-flash';

    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: instruction,
        tools: [{ googleSearch: {} }], 
      },
      // @ts-ignore - The SDK types might be slightly strict about history format, but this structure works
      history: formattedHistory,
    });

    // Prepare current message parts
    const currentParts: any[] = [{ text: message }];
    if (image) {
        const base64Data = image.split(',')[1] || image;
        currentParts.push({
            inlineData: {
                mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or extract from string
                data: base64Data
            }
        });
    }

    const result = await chat.sendMessage({
      content: { parts: currentParts }
    });

    const responseText = result.text;
    const groundingMetadata = result.candidates?.[0]?.groundingMetadata;

    return {
      text: responseText,
      groundingMetadata: groundingMetadata
    };
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    throw error;
  }
};