import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const frontend_url = "http://localhost:5173/";

const placeOrder = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ success: false, message: "Invalid token" });

    const userId = decoded.id;


    const newOrder = new Order({
      userId,
      items: req.body.items,
      amount: req.body.amount,
      phone: req.body.phone,
      address: req.body.address,
    });

    
    await newOrder.save();
    await User.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(200).json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Order Placement Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email"); // Populate with `username` and `email` from the `User` model
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get Orders Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const getOrderById = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ success: false, message: "Invalid token" });

    const userId = decoded.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    if (!orders) {
      console.log("No orders found for user:", userId); // Log if no orders are returned
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get Order Error:", error); // Log the error for more details
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// Update order status
const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    return res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    return res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete Order Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export { placeOrder,getOrderById,getAllOrders,updateOrderStatus,deleteOrder };
