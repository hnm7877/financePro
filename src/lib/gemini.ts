import { GoogleGenerativeAI } from "@google/generative-ai";
import { InvoiceCategory } from "@/types/invoice";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function analyzeInvoice(fileBuffer: Buffer, mimeType: string) {
  const models = [
    "gemini-3-pro-preview",
    "gemini-3-flash-preview",
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-1.5-flash" // Stable fallback
  ];
  
  const systemPrompt = `
    Tu es un expert en comptabilité. Analyse cette facture et extrais les informations suivantes au format JSON uniquement.
    Le format doit être STRICTEMENT :
    {
      "merchant": "Nom du marchand",
      "date": "YYYY-MM-DD",
      "amount": 123.45,
      "category": "Une des catégories suivantes : [${Object.values(InvoiceCategory).join(", ")}]"
    }
    
    Si tu ne trouves pas une information, laisse le champ vide ou à 0.
    Choisis la catégorie la plus proche parmi la liste fournie.
  `;

  let lastError = null;

  for (const modelName of models) {
    try {
      console.log(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent([
        systemPrompt,
        {
          inlineData: {
            data: fileBuffer.toString("base64"),
            mimeType,
          },
        },
      ]);

      const response = await result.response;
      
      // If we got here, we might still have a response object but it could be blocked
      // SDK sometimes throws, sometimes returns error in response.
      // Let's ensure text() works or catch it.
      const text = response.text();
      
      // Basic JSON extraction from markdown if formatted
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return JSON.parse(text);
    } catch (error: any) {
      console.error(`Error with model ${modelName}:`, error);
      
      lastError = error;
      // Continue to next model if available
    }
  }

  throw lastError || new Error("Failed to analyze invoice with any model");
}
