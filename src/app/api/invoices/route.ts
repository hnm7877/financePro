import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import Associate from "@/models/Associate";
import { Company } from "@/models/Company";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email requis" }, { status: 400 });
    }

    await connectDB();
    const company = await Company.findOne({ email });
    
    if (!company) {
      return NextResponse.json({ message: "Société non trouvée" }, { status: 404 });
    }

    const invoices = await Invoice.find({ companyId: company._id }).sort({ date: -1 });
    
    return NextResponse.json(invoices);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, ...invoiceData } = body;

    if (!email) {
      return NextResponse.json({ message: "Email requis" }, { status: 400 });
    }

    await connectDB();
    const company = await Company.findOne({ email });

    if (!company) {
      return NextResponse.json({ message: "Société non trouvée" }, { status: 404 });
    }

    const newInvoice = await Invoice.create({
      ...invoiceData,
      companyId: company._id,
    });

    // Validated Invoice: Distribute expenses
    if (invoiceData.status === "Ventilé") {
      const associates = await Associate.find({ companyId: company._id, status: 'Actif' });
      
      for (const associate of associates) {
        const expenseShare = invoiceData.amount * associate.share;
        await Associate.findByIdAndUpdate(associate._id, {
          $inc: { totalExpenses: expenseShare }
        });
      }
    }

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
