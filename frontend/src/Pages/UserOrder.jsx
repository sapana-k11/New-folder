import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../Components/Context/StoreContext";

const BACKEND_URL = "http://localhost:4000/api/order/user";

function UserOrder() {
  const { token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(BACKEND_URL, { headers: { token } });

      if (response.data.success) {
        setOrders(response.data.orders);
        console.log(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="divide-y divide-gray-300">
          {orders.map((order) => (
            <li key={order._id} className="py-4">
              <div>
                <p className="text-gray-500">
                  Placed on:{" "}
                  {new Date(order.date).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p className="text-gray-500">Delivery Status: {order.status}</p>
                <p className="font-medium text-lg mt-2">
                  Shipping Address: {order.address}
                </p>
                <p className="text-gray-500">Phone: {order.phone}</p>
                <p className="mt-2 font-semibold">Items:</p>
                <ul className="list-disc ml-5">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>
                        Rs {item.price} x {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-semibold">
                  Delivery Charge: Rs 50
                </p>
                <p className="mt-2 font-semibold">
                  Total Amount: Rs {order.amount}
                </p>
                <p className="mt-2 text-green-600">
                  Payment Status: Paid
                </p>

              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserOrder;
