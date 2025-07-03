import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";



export const StoreContext = createContext(null);
const url = "http://localhost:4000";

const StoreContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [cart, setCart] = useState({});

  // Fetch cart data when token or username changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      fetchCart();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setCart({});
    }
  }, [token, username]);

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!token) return;
  
    try {
      const response = await axios.get(`${url}/api/cart/fetch`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cartData = response.data.cartData || {};
  
      const updatedCart = {};
      for (const itemId in cartData) {
        const productResponse = await axios.get(`${url}/api/products/${itemId}`);
        const product = productResponse.data;
  
        updatedCart[itemId] = {
          image: product.image,
          name: product.name,
          price: product.price,
          quantity: cartData[itemId],
        };
      }
  
      setCart(updatedCart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };
  
  // Add item to cart
  const addToCart = async (itemId) => {
    try {
      // Fetch product details
      const response = await axios.get(`${url}/api/products/${itemId}`);
      const product = response.data;
  
      // Update local cart state
      setCart((prev) => {
        const existingItem = prev[itemId] || { name: product.name, price: product.price, image: product.image, quantity: 0 };
        return {
          ...prev,
          [itemId]: { ...existingItem, quantity: existingItem.quantity + 1 },
        };
      });
  
      // Update cart in the backend
      if (token) {
        await axios.post(`${url}/api/cart/add`, { itemId }, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  
  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      // Update local cart state
      setCart((prev) => {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      });
  
      // Update cart in the backend
      if (token) {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };
  

  // Context value to be provided to components
  const contextValue = {
    token,
    setToken,
    username,
    setUsername,
    cart,
    setCart,
    addToCart,
    removeFromCart,
    fetchCart,
  };

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};

StoreContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreContextProvider;