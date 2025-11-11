import { GoogleGenAI } from "@google/genai";
import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.apiKey as string | undefined;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("API_KEY not found in app.config.js extra. Mentor feature will be disabled.");
}


export const getMentorResponse = async (userMessage: string, fastingHours: number): Promise<string> => {
  if (!ai) {
    return "The mentor is resting. Please configure the API key to wake them up.";
  }
  
  try {
    const systemInstruction = `You are a wise, calm, and encouraging fasting mentor for the 'Ritual' app. Your tone is respectful, slightly stoic, but deeply supportive. The user has been fasting for ${fastingHours.toFixed(1)} hours. Keep responses concise (2-3 sentences). Acknowledge their message, offer wisdom or encouragement related to their fast, and end on a positive or thoughtful note. Do not use emojis.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error getting response from Gemini API:", error);
    return "I'm having trouble finding my words right now. Please try again in a moment.";
  }
};