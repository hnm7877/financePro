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
    Tu es un expert comptable IA spécialisé dans l'extraction de données de factures françaises.
    Analyse ce document (image ou PDF) et extrais les informations structurées ci-dessous.
    
    RÈGLES STRICTES :
    1. Réponds UNIQUEMENT avec un objet JSON valide. Pas de markdown, pas de texte avant ou après.
    2. Si une valeur est incertaine, utilise null ou 0.
    3. Normalise le nom du marchand (ex: "McDonald's France" -> "McDonald's").
    4. La date doit être au format ISO (YYYY-MM-DD).
    5. Identifie la devise (EUR, USD, GBP, etc.). Si non trouvée, utilise "XOF".

    FORMAT JSON ATTENDU :
    {
      "merchant": "Nom du marchand",
      "date": "YYYY-MM-DD",
      "amount": 0.00, // Nombre flottant
      "currency": "XOF", // Code ISO devise
      "category": "Catégorie exacte parmi : [${Object.values(InvoiceCategory).join(", ")}]"
    }
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
