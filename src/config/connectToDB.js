import mongoose from "mongoose";
import "dotenv/config";

const connectToDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB ✅");
  } catch (error) {
    console.log("Error connecting to MongoDB");
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectToDB;
