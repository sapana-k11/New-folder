import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from 'dotenv';

dotenv.config();

// Function to verify token and get userId
const verifyToken = (req) => {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new Error("Unauthorized: No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded.id;
};


// Add to cart
const addToCart = async (req, res) => {
    try {
        const userId = verifyToken(req); // Verify token and get userId
        const { itemId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = user.cartData || {};
        cartData[itemId] = (cartData[itemId] || 0) + 1;

        await User.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Item added to cart", cartData });
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: error.message || "Error adding to cart" });
    }
};

// Remove from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = verifyToken(req);
        const { itemId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = user.cartData || {};

        if (cartData[itemId]) {
            delete cartData[itemId];
            await User.findByIdAndUpdate(userId, { cartData });
            return res.json({ success: true, message: "Item removed from cart", cartData });
        }

        res.status(400).json({ success: false, message: "Item not found in cart" });
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: error.message || "Error removing item" });
    }
};

// Fetch cart
const fetchCart = async (req, res) => {
    try {
        const userId = verifyToken(req);
        console.log(userId)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: user.cartData || {} });
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: error.message || "Error fetching cart" });
    }
};

export { addToCart, removeFromCart, fetchCart };
