const mongoose = require("mongoose");
const Associate = require("./src/models/Associate").default;
const { connectDB } = require("./src/lib/mongodb");

async function list() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/fintrack";
    await mongoose.connect(MONGODB_URI);
    const associates = await Associate.find({});
    console.log(JSON.stringify(associates, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
list();
