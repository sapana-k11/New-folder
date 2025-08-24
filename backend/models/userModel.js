// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    ratings: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product"},
            rating: { type: Number, min: 1, max: 5, required: true }
        }
    ]
}, { minimize: false });

const User = mongoose.model('User', userSchema);

export default User;
