import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../Components/Context/StoreContext";
import { toast } from "react-toastify";
import StarRating from "../UI/StarRating";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddReview, setShowAddReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  const { addToCart, token } = useContext(StoreContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/products/${id}`
        );
        setProduct(response.data);
        console.log(product);
      } catch (err) {
        setError("Failed to load product details.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/review/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Ensure token is sent
            },
          }
        );
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.message || "Failed to fetch reviews");

        setReviews(Array.isArray(data.reviews) ? data.reviews : []); // Ensure it's always an array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    const parsedRating = parseInt(rating);

    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      toast.error("Rating must be a number between 1 and 5.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/review/add",
        { productId: id, rating: parsedRating, comment: review },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the product reviews after submission
      setReviews((prev) => [...prev, response.data.review]);

      toast.success("Review added successfully!");
      setShowAddReview(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review.");
    }
  };

  if (loading)
    return <div className="text-center text-xl mt-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-xl mt-10 text-red-500">{error}</div>
    );
  if (!product)
    return <div className="text-center text-xl mt-10">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <h2 className="text-xl text-gray-600">by {product.artist}</h2>

      <div className="mt-4 flex gap-6 flex-col md:flex-row">
        <img
          src={product.image}
          alt={product.name}
          className="w-64 h-64 object-cover rounded-lg shadow-lg"
        />
        <div>
          <p className="text-lg font-semibold text-gray-800">
            Price: Rs {product.price}
          </p>
          <p className="text-gray-700">{product.description}</p>

          <p className="mt-2 text-sm text-gray-600">
            <strong>Release Date:</strong> {product.releaseYear} <br />
            <strong>Duration:</strong> {product.duration} mins
          </p>

          <div className="mt-4">
            <p className="text-lg">
              ⭐ {product.rating.toFixed(1)} / 5 ({product.numberOfRatings}{" "}
              reviews)
            </p>
          </div>

          <button
            onClick={() => {
              addToCart(id);
              toast.success("Product Added to Cart");
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Add to Cart 🛒
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        {token && (
          <button
            className="p-2 cursor-pointer bg-green-500 border border-gray-800 rounded-2xl"
            onClick={() => setShowAddReview((prev) => !prev)}
          >
            {showAddReview ? "Cancel Review" : "Review this product"}
          </button>
        )}

        {showAddReview && (
          <form
            className="shadow-2xl p-4 mt-4 bg-gray-100 rounded-lg"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-3">
              <StarRating onChange={(rate) => setRating(rate)} />
              <textarea
                placeholder="Add Your Review"
                className="w-full border-2 border-gray-800 rounded-2xl p-2"
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 border-2 border-gray-800 rounded-2xl p-2 mt-2"
            >
              Submit
            </button>
          </form>
        )}

        <h3 className="text-2xl font-semibold mt-6">Reviews</h3>
        {reviews && reviews.length > 0 ? (
          <ul className="mt-4">
            {reviews.map((rev, index) => (
              <li key={index} className="border-b py-3">
                <p className="font-semibold">
                  {rev.userId?.name || "Anonymous"}
                </p>{" "}
                {/* Fallback for missing user info */}
                <p>⭐ {rev.rating} / 5</p>
                <p className="text-gray-700">
                  {rev.comment || "No comment provided."}
                </p>{" "}
                {/* Fallback for missing comment */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Product;
