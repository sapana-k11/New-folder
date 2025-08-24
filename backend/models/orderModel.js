import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Use ObjectId here
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "Processing" },
  phone: { type: String, required: true },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: true },
  address: { type: String, required: true }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
