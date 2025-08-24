import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import productRouter from "./routes/productRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Handle form data
app.use(cors());

// Connect to MongoDB
connectDB();

// Serve uploaded images statically
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// API Routes
app.use("/api/products", productRouter);
app.use("/api/review", reviewRouter);
app.use("/api/user", userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);





app.get("/", (req, res) => {
    res.send("API is working");
});

// Start Server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
