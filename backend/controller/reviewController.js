// controllers/reviewController.js
import { populate } from 'dotenv';
import Product from '../models/productModel.js';
import Review from '../models/reviewModel.js';
import User from '../models/userModel.js';

export const addReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.userId; // Get the userId from the authenticated user

    if (!productId || !rating || !comment) {
        return res.status(400).json({ success: false, message: "Product ID, Rating, and Comment are required" });
    }

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Check if the user has already rated this product
        const existingReview = await Review.findOne({ productId, userId });
        if (existingReview) {
            return res.status(400).json({ success: false, message: "You have already reviewed this product." });
        }

        // Create and save the new review
        const newReview = new Review({ productId, userId, rating, comment });
        await newReview.save();

        // Add review ID to the product's reviews array
        product.reviews.push(newReview._id);

        // Recalculate rating
        const sumOfRatings = await Review.aggregate([
            { $match: { productId } },
            { $group: { _id: null, totalRating: { $sum: '$rating' }, count: { $sum: 1 } } }
        ]);

        if (sumOfRatings.length > 0) {
            product.rating = (sumOfRatings[0].totalRating / sumOfRatings[0].count).toFixed(1);
            product.numberOfRatings = sumOfRatings[0].count;
        } else {
            product.rating = rating;
            product.numberOfRatings = 1;
        }

        await product.save();

        // ✅ Update the user's ratings array in the User schema
        await User.findByIdAndUpdate(userId, {
            $push: { ratings: { productId, rating } }
        });

        res.status(201).json({ success: true, review: newReview, product });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};






// Get reviews for a specific product
export const getProductReviews = async (req, res) => {
    try {
      const { productId } = req.params;
      
      const reviews = await Review.find({ productId })
        .populate('userId', 'name')  // Populate userId with the 'name' field
        .populate('productId', 'artist');  // Populate productId with the 'artist' field
  
      res.status(200).json({ success: true, reviews: reviews || [] });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  