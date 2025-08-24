import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
           
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1); // Exit the process if DB fails
    }
};
