import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'dummy_gemini_key');

export const generateTaskSummary = async (taskTitle, taskDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a productivity AI. Summarize the following task in 1 short, actionable sentence. Focus on the core objective. \n\nTitle: ${taskTitle}\nDescription: ${taskDescription}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    return "AI Summary unavailable.";
  }
};
