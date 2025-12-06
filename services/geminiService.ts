import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const sendMessageToGemini = async (
  message: string,
  history: { role: 'user' | 'model'; text: string }[],
  simpleLanguage: boolean
) => {
  try {
    const formattedHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }],
    }));

    let instruction = SYSTEM_INSTRUCTION;
    if (simpleLanguage) {
      instruction += "\n\n[OVERRIDE]: The user has requested 'Simple Language'. Explain complex concepts using everyday analogies. Avoid technical meteorological terms like 'orographic' without immediate, simple explanation. Keep sentences short.";
    }

    const modelId = 'gemini-2.5-flash';

    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: instruction,
        tools: [{ googleSearch: {} }], 
      },
      history: formattedHistory,
    });

    const result = await chat.sendMessage({
      message: message
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