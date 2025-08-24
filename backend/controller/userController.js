import User from "../models/userModel.js"; 
import Product from "../models/productModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import 'dotenv/config';

// Create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body; // ✅ Correct field name

    try {
        // Check if user already exists
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Enter a valid email" });
        }

        // Password validation
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save new user
        const newUser = new User({
            name,  // ✅ Now correctly references `name`
            email,
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        res.status(201).json({ success: true, token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// Login user (implement logic)
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Password doesn't match" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token, username: user.name }); // Include username in response
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
};


const recommendedProduct = async (req, res) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.ratings.length) {
            return res.status(200).json({ message: "Rate products first to get recommendations." });
        }

        // Fetch only rated product IDs
        const ratedProductIds = user.ratings.map(rating => rating.productId);
        
        // Fetch rated products in a single query
        const ratedProducts = await Product.find({ _id: { $in: ratedProductIds } });

        // Calculate genre preferences
        const genreWeights = {};
        user.ratings.forEach(({ productId, rating }) => {
            const product = ratedProducts.find(p => p._id.equals(productId));
            if (product) {
                product.genre.forEach(genre => {
                    genreWeights[genre] = (genreWeights[genre] || 0) + rating;
                });
            }
        });

        // Fetch all products except the ones already rated
        const allProducts = await Product.find({ _id: { $nin: ratedProductIds } });

        // Compute similarity scores
        const scoredProducts = allProducts.map((product) => {
            let score = 0;
            product.genre.forEach((genre) => {
                if (genreWeights[genre]) score += genreWeights[genre];
            });
            score += product.rating * 0.5; // Boost based on rating
            return { ...product.toObject(), similarityScore: score };
        });

        // Sort by similarity score and return top 5
        const recommended = scoredProducts
            .sort((a, b) => b.similarityScore - a.similarityScore).slice(0,6);

        res.json(recommended);
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export { loginUser, registerUser,recommendedProduct };
