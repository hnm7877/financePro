import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Company from "@/models/Company";
import { createExpenseSchema, EXPENSE_CATEGORY_ICONS } from "@/types/expense";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const period = searchParams.get("period");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find company by email
    const company = await Company.findOne({ email });
    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Build query
    const query: any = { companyId: company._id };
    if (period) {
      query.period = period;
    }

    // Fetch expenses
    const expenses = await Expense.find(query).sort({ startDate: -1 });

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, ...expenseData } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate expense data with Zod
    const validatedData = createExpenseSchema.parse(expenseData);

    // Find company by email
    const company = await Company.findOne({ email });
    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Create expense
    const expense = await Expense.create({
      ...validatedData,
      companyId: company._id,
      icon: EXPENSE_CATEGORY_ICONS[validatedData.category],
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    console.error("Error creating expense:", error);
    
    // Handle Zod validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
