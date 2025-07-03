import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ADMIN_URL = "http://localhost:4000/api/order"; // Update with your API URL

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${ADMIN_URL}/all`);
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`${ADMIN_URL}/update-status`, {
        orderId,
        status,
      });
      if (response.data.success) {
        toast.success("Order status updated!");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const response = await axios.delete(`${ADMIN_URL}/delete/${orderId}`);
      if (response.data.success) {
        toast.success("Order deleted successfully!");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Admin Orders</h2>
      
      {loading ? (
        <div className="text-center py-4">Loading orders...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr className="border-b text-sm">
                <th className="px-4 py-2 text-left whitespace-nowrap">Phone</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Username</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Total</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Address</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Status</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Items</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b text-sm">
                  <td className="px-4 py-2">{order.phone}</td>
                  <td className="px-4 py-2">{order.userId.name}</td>
                  <td className="px-4 py-2">Rs {order.amount}</td>
                  <td className="px-4 py-2">{order.address}</td>
                  <td className="px-4 py-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="px-2 py-1 border rounded w-full md:w-auto"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Delivering">Delivering</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Shipping">Shipping</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    {order.items.map((item) => (
                      <div key={item.name}>
                        {item.name} X {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderList;
