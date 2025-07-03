import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import Card from "./Card";

function Cards({ search }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/products/list"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle case when no data is available
  if (data.length === 0) {
    return (
      <div className="text-center text-red-500">
        Server Down. Please wait a while
      </div>
    );
  }

  // Filter products based on search query (case-insensitive)
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.artist.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="grid place-items-center sm:grid-cols-2 lg:grid-cols-3 gap-5 md:px-10">
      {filteredData.length > 0 ? (
        filteredData.map((item) => (
          <Link key={item._id} to={`/product/${item._id}`}>
            <Card
              _id={item._id}
              name={item.name}
              artist={item.artist}
              image={item.image}
              price={item.price}
              genre={item.genre}
              releaseYear={item.releaseYear}
              duration={item.duration}
              rating={item.rating}
              numberOfRatings={item.numberOfRatings}
            />
          </Link>
        ))
      ) : (
        <div className="text-white text-4xl text-center w-screen relative ">
          <span className="absolute top-[-35px] right-10 ">No results found for {search}</span>
        </div>
      )}
    </div>
  );
}

// PropTypes validation
Cards.propTypes = {
  search: PropTypes.string.isRequired, // Ensures search is always a string
};

export default Cards;
