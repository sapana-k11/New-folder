import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ProductList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products/list");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/products/delete/${id}`);
      setData((prevData) => prevData.filter((item) => item._id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  if (!data.length) {
    return <div className="text-center text-white">Server Down or No Products Available</div>;
  }

  return (
    <div className="text-white p-5">
      <div className="grid grid-cols-5 font-bold mb-3 border-b pb-2">
        <span>Image</span>
        <span>Name</span>
        <span>Artist</span>
        <span>Price</span>
        <span>Remove</span>
      </div>
      {data.map((item) => (
        <div key={item._id} className="grid grid-cols-5 items-center p-3 border-b hover:bg-gray-800">
          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
          <span>{item.name}</span>
          <span>{item.artist}</span>
          <span>Rs {item.price}</span>
          <span 
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => handleDelete(item._id)}
          >
            X
          </span>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
