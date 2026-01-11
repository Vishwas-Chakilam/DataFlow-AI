import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 
// Ideally, we handle missing key gracefully in UI, but assuming environment is set up as per prompt.

let ai: GoogleGenAI | null = null;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.error("Failed to initialize Gemini:", error);
}

export const getGeminiInsights = async (datasetSummary: string): Promise<string> => {
  if (!ai) return "AI Service Unavailable. Please check API Key.";
  
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      You are an expert Data Scientist. 
      Analyze the following dataset summary:
      ${datasetSummary}
      
      Provide a brief, professional summary of:
      1. Potential Data Cleaning steps required.
      2. Suggested Machine Learning models (e.g., Random Forest, Linear Regression).
      3. One interesting potential insight or pattern to look for.
      
      Keep it concise (under 150 words). Format as markdown.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error analyzing data.";
  }
};

export const getPrediction = async (modelName: string, features: Record<string, string>): Promise<string> => {
    if (!ai) return "AI Service Unavailable.";

    try {
        const model = 'gemini-3-flash-preview';
        const prompt = `
          Act as a trained Machine Learning model (${modelName}).
          Based on the following input features:
          ${JSON.stringify(features, null, 2)}
          
          Predict the outcome. Since you don't have the real trained weights, simulate a realistic prediction based on common patterns for such data. 
          Return ONLY the prediction value and a confidence score.
        `;
    
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        
        return response.text || "Prediction failed.";
      } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error generating prediction.";
      }
}

export const generateQuizQuestions = async (): Promise<string> => {
    if (!ai) return "[]";
    try {
        const model = 'gemini-3-flash-preview';
        const prompt = `
          Generate 5 simple Machine Learning multiple choice questions in JSON format.
          Structure: Array of objects with 'question', 'options' (array of strings), 'answer' (index of correct option).
          Return ONLY valid JSON. No markdown backticks.
        `;
         const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        let text = response.text || "[]";
        // Clean markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return text;
    } catch(e) {
        console.error(e);
        return "[]";
    }
}
