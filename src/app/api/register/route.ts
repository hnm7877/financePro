import { NextResponse } from "next/server";
import { registerSchema } from "@/components/features/auth/schema";
import { connectDB } from "@/lib/mongodb";
import Company from "@/models/Company";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate data on the server side as well
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.format() },
        { status: 400 }
      );
    }

    await connectDB();

    const { email } = validation.data;

    // Check if user already exists
    const existingCompany = await Company.findOne({ email });

    if (existingCompany) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé par une autre entreprise." },
        { status: 409 }
      );
    }

    // Create new company
    const newCompany = await Company.create(validation.data);

    return NextResponse.json(
      {
        fullName: newCompany.fullName,
        companyName: newCompany.companyName,
        email: newCompany.email,
        country: newCompany.country,
        phoneNumber: newCompany.phoneNumber,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne lors de l'inscription." },
      { status: 500 }
    );
  }
}
