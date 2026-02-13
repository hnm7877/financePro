import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Associate } from "@/models/Associate";
import { Company } from "@/models/Company";

async function getCompanyId(email: string) {
  const company = await Company.findOne({ email });
  if (!company) throw new Error("Société non trouvée");
  return company._id;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email requis" }, { status: 400 });
    }

    await connectDB();
    const companyId = await getCompanyId(email);
    const associates = await Associate.find({ companyId });

    return NextResponse.json(associates);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { 
      name, 
      associateEmail, 
      phone, 
      roles, 
      share, 
      avatar, 
      email 
    } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ message: "L'email et le nom sont requis." }, { status: 400 });
    }

    await connectDB();
    const companyId = await getCompanyId(email);

    const associate = await Associate.create({
      companyId,
      name,
      email: associateEmail,
      phone,
      roles: roles || ['Associé'],
      share: share / 100, // Convert percentage to decimal
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      isPrimary: false,
      status: 'Actif'
    });

    return NextResponse.json(associate);
  } catch (error: any) {
    console.error("Error in POST /api/associates:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
