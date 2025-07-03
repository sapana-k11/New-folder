import { useContext } from "react";
import { StoreContext } from "../Components/Context/StoreContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart } = useContext(StoreContext);
  const navigate = useNavigate();

  // Calculate total price
  const totalPrice = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
  console.log("cart",cart)

  return (
    <div className="w-90 mx-auto p-6 bg-white rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {Object.keys(cart).length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <ul>
          {Object.entries(cart).map(([id, item]) => (
            <li key={id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg" />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Rs {item.price} x {item.quantity}</p>
                </div>
              </div>
              <button onClick={() => removeFromCart(id)} className="text-red-500 cursor-pointer hover:underline">
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Total Price */}
      {Object.keys(cart).length > 0 && (
        <div className="flex justify-between p-4">
            <button className="border-1 border-black bg-green-500 hover:bg-green-600 cursor-pointer text-white p-2 rounded-2xl" onClick={()=>navigate("/order")}>Checkout</button>
          <h3 className="text-xl font-semibold">Total: Rs {totalPrice}</h3>
        </div>
      )}
    </div>
  );
}

export default Cart;
