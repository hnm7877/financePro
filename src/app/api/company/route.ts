import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/models/Company";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, companyName, siret, address, currency } = body;

    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis pour identifier l'entreprise." },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedCompany = await Company.findOneAndUpdate(
      { email },
      {
        $set: {
          companyName,
          siret,
          address,
          currency,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedCompany) {
      return NextResponse.json(
        { error: "Entreprise non trouvée." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      fullName: updatedCompany.fullName,
      companyName: updatedCompany.companyName,
      email: updatedCompany.email,
      country: updatedCompany.country,
      phoneNumber: updatedCompany.phoneNumber,
      siret: updatedCompany.siret,
      address: updatedCompany.address,
      currency: updatedCompany.currency,
    });
  } catch (error: any) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des paramètres." },
      { status: 500 }
    );
  }
}
