import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../Components/Context/StoreContext";
import { Link } from "react-router-dom";
import Card from "../Components/cards/Card";

function Personalisation() {
  const { token } = useContext(StoreContext);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4000/api/user/recommended",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("API Response:", response.data); // Debugging

        // Ensure response.data is an array before setting state
        if (Array.isArray(response.data)) {
          setRecommendedProducts(response.data);
        } else if (response.data && Array.isArray(response.data.recommended)) {
          setRecommendedProducts(response.data.recommended);
        } else {
          setRecommendedProducts([]);
          setError("Rate the products first to get recommendation.");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [token]);

  if (!token)
    return <p className="text-center">Login first and rate to get recommendations</p>;

  if (loading) return <p className="text-center">Loading recommendations...</p>;

  if (error) return <p className="text-3xl text-center">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
      {recommendedProducts.length === 0 ? (
        <p className="text-gray-500">No recommendations available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedProducts.map((item) => (
            <Link key={item._id} to={`/product/${item._id}`}>
              <Card
                _id={item._id}
                name={item.name}
                artist={item.artist}
                image={`http://localhost:4000/uploads/${item.image}`}
                price={item.price}
                genre={item.genre}
                releaseYear={item.releaseYear}
                duration={item.duration}
                rating={item.rating}
                numberOfRatings={item.numberOfRatings}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Personalisation;
