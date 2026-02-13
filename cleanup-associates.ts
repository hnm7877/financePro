import mongoose from "mongoose";
import Associate from "./src/models/Associate.ts";
import Company from "./src/models/Company.ts";
import { connectDB } from "./src/lib/mongodb.ts";

async function cleanup() {
  try {
    const email = "hnm@example.com"; // Based on the screenshot "Tableau de Bord (HNM)"
    await connectDB();
    
    const company = await Company.findOne({ email: /hnm/i }); // Robust search
    if (!company) {
      console.log("Company not found");
      process.exit(1);
    }

    console.log(`Cleaning up associates for company: ${company.name} (${company._id})`);
    
    const result = await Associate.deleteMany({ companyId: company._id });
    console.log(`Deleted ${result.deletedCount} associates.`);
    
    process.exit(0);
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  }
}

cleanup();
