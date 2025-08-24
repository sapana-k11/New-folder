import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder,getAllOrders, getOrderById,updateOrderStatus,deleteOrder } from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", placeOrder);
orderRouter.get("/all",getAllOrders ); // Admin
orderRouter.get("/user",getOrderById); // User orders
orderRouter.put("/update-status",updateOrderStatus);
orderRouter.delete("/delete/:orderId",deleteOrder);

export default orderRouter;
