import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artist: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    genre: { type: [String], required: true },
    releaseYear: { type: String, required: true, default: "unknown" }, // Change to releaseYear
    duration: { type: Number, required: true },
    rating: { type: Number, default: 0 },  // Overall average rating
    numberOfRatings: { type: Number, default: 0 },  // Total number of ratings
    description: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Review' }], // Reference to reviews collection
});

const Product = mongoose.model('Product', productSchema);

export default Product;
