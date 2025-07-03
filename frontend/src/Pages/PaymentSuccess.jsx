import { useEffect, useState, useContext, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../Components/Context/StoreContext";
import {toast} from 'react-toastify'

const BACKEND_URL = "http://localhost:4000/api/order/place";

function PaymentSuccess() {
  const [search] = useSearchParams();
  const { cart, token ,setCart} = useContext(StoreContext);
  const [data, setData] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const address = localStorage.getItem("address");
  const phone = localStorage.getItem("phone");
  const orderPlacedRef = useRef(false); // Prevent duplicate requests

  useEffect(() => {
    if (search.get("data") && !orderPlacedRef.current) {
      try {
        const resData = atob(search.get("data"));
        const resObject = JSON.parse(resData);
        setData(resObject);
        orderPlacedRef.current = true; // Mark as processed
      } catch (error) {
        console.error("Error parsing payment data:", error);
      }
    }
  }, [search]);

  const placeOrder = async () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
  
    try {
      const totalAmount = Object.values(cart).reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
  
      const response = await axios.post(
        BACKEND_URL,
        {
          items: Object.values(cart).map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          amount: totalAmount, // Include total amount
          address,
          phone,
        },
        { headers: { token } }
      );
  
      if (response.status === 200) {
        toast.success("Order placed successfully");
        setCart({});
      } else {
        toast.error("Order placement failed");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };
  

  return (
    <div className="text-4xl flex flex-col gap-4">
      <span className="text-center">
        Payment Successful! ✅ Amount: Rs {data?.total_amount}
      </span>
      {Object.keys(cart).length > 0 ? (
        <button
          className="cursor-pointer hover:text-blue-800 disabled:opacity-50"
          onClick={placeOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? "Placing Order..." : "Click here to finalize your order"}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}

export default PaymentSuccess;
