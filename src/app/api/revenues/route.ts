import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Revenue from "@/models/Revenue";
import Company from "@/models/Company";
import { createRevenueSchema } from "@/types/revenue";

// GET - Récupérer les revenus
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const period = searchParams.get("period");

    if (!email) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    // Trouver l'entreprise
    const company = await Company.findOne({ email });
    if (!company) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404 }
      );
    }

    // Construire la requête
    const query: any = { companyId: company._id };
    if (period) {
      query.period = period;
    }

    // Récupérer les revenus
    const revenues = await Revenue.find(query).sort({ date: -1 });

    return NextResponse.json({
      success: true,
      revenues,
      count: revenues.length,
    });
  } catch (error) {
    console.error("Error fetching revenues:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des revenus" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau revenu
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, ...revenueData } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    // Valider les données
    const validatedData = createRevenueSchema.parse(revenueData);

    // Trouver l'entreprise
    const company = await Company.findOne({ email });
    if (!company) {
      return NextResponse.json(
        { error: "Entreprise non trouvée" },
        { status: 404 }
      );
    }

    // Créer le revenu
    const revenue = await Revenue.create({
      ...validatedData,
      companyId: company._id,
      date: new Date(validatedData.date),
    });

    return NextResponse.json({
      success: true,
      revenue,
      message: "Revenu créé avec succès",
    });
  } catch (error: any) {
    console.error("Error creating revenue:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la création du revenu" },
      { status: 500 }
    );
  }
}
