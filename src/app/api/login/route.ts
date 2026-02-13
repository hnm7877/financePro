import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/models/Company";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    await connectDB();

    // Since we don't have a real password hashing yet, 
    // we just check if the company/user exists by email.
    // In a real app, you would verify the hashed password.
    const company = await Company.findOne({ email });

    if (!company) {
      return NextResponse.json(
        { message: "Identifiants invalides" },
        { status: 401 }
      );
    }

    // Mock successful login
    return NextResponse.json({
      fullName: company.fullName,
      companyName: company.companyName,
      email: company.email,
      country: company.country,
      phoneNumber: company.phoneNumber,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}
