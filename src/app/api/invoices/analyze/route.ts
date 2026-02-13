import { NextResponse } from "next/server";
import { analyzeInvoice } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "Aucun fichier fourni" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;

    const data = await analyzeInvoice(buffer, mimeType);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'analyse par l'IA", details: error.message },
      { status: 500 }
    );
  }
}
