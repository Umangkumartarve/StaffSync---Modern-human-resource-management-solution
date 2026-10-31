const mongoose = require("mongoose");

// Tries your MONGO_URI first. If MongoDB isn't running, it automatically starts
// an in-memory MongoDB so the app still works (great for demos).
const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hrm";
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log("MongoDB connected:", uri);
  } catch (err) {
    console.log("Local MongoDB not found -> starting in-memory MongoDB (demo mode)...");
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mem = await MongoMemoryServer.create();
      await mongoose.connect(mem.getUri("hrm"));
      console.log("In-memory MongoDB connected (data resets when server stops)");
    } catch (e) {
      console.error("Could not connect to any MongoDB:", e.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
