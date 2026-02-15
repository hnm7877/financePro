import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import Expense from "@/models/Expense";
import { Associate } from "@/models/Associate";
import Company from "@/models/Company";
import { calculateDividendsSchema } from "@/types/expense";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, period, startDate, endDate } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate request data with Zod
    const validatedData = calculateDividendsSchema.parse({
      period,
      startDate,
      endDate,
    });

    // Find company by email
    const company = await Company.findOne({ email });
    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Parse dates
    const start = new Date(validatedData.startDate);
    const end = new Date(validatedData.endDate);

    // Calculate the number of days in the period for expense prorating
    const periodDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Try to get revenues first (new system)
    const Revenue = (await import("@/models/Revenue")).default;
    const revenues = await Revenue.find({
      companyId: company._id,
      status: "Encaissé",
      date: { $gte: start, $lte: end },
    });

    let grossRevenue = 0;

    // Use revenues if available, otherwise fallback to invoices
    if (revenues && revenues.length > 0) {
      // Cumulate ALL revenues in the period
      grossRevenue = revenues.reduce((sum, rev) => sum + rev.amount, 0);
    } else {
      // Fallback: Calculate gross revenue from invoices with status "Ventilé"
      const invoices = await Invoice.find({
        companyId: company._id,
        status: "Ventilé",
        date: { $gte: start, $lte: end },
      });
      grossRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    }

    // Get ALL active expenses (regardless of their period)
    const expenses = await Expense.find({
      companyId: company._id,
      status: "Active",
      startDate: { $lte: end },
      $or: [
        { endDate: { $gte: start } },
        { endDate: { $exists: false } },
      ],
    });

    // Calculate total expenses for the period, converting all to monthly equivalent
    const totalExpenses = expenses.reduce((sum, exp) => {
      let monthlyAmount = 0;

      // Convert expense to monthly amount based on period
      switch (exp.period) {
        case "Quotidien":
          monthlyAmount = exp.amount * periodDays;
          break;
        case "Hebdomadaire":
          monthlyAmount = (exp.amount * periodDays) / 7;
          break;
        case "Mensuel":
          monthlyAmount = exp.amount;
          break;
        case "Trimestriel":
          monthlyAmount = exp.amount / 3;
          break;
        case "Annuel":
          monthlyAmount = exp.amount / 12;
          break;
        default:
          monthlyAmount = exp.amount;
      }

      return sum + monthlyAmount;
    }, 0);

    // Calculate net dividends
    const netDividends = grossRevenue - totalExpenses;
    const netMargin = grossRevenue > 0 ? (netDividends / grossRevenue) * 100 : 0;

    // Get associates
    const associates = await Associate.find({
      companyId: company._id,
      status: "Actif",
    });

    // Calculate dividend distribution for each associate
    const calculations = associates.map((associate) => {
      const associateGrossRevenue = grossRevenue * associate.share;
      const associateExpenses = totalExpenses * associate.share;
      const associateNetDividend = netDividends * associate.share;

      return {
        associateId: associate._id.toString(),
        associateName: associate.name,
        share: associate.share,
        grossRevenue: associateGrossRevenue,
        expenseShare: associateExpenses,
        netDividend: associateNetDividend,
      };
    });

    // Create summary
    const summary = {
      period: validatedData.period,
      grossRevenue,
      totalExpenses,
      netDividends,
      netMargin,
    };

    return NextResponse.json(
      {
        calculations,
        summary,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error calculating dividends:", error);

    // Handle Zod validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to calculate dividends" },
      { status: 500 }
    );
  }
}
