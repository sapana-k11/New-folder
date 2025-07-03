import { useState, useContext, useEffect, useMemo } from "react";
// import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { StoreContext } from "../Components/Context/StoreContext";

// const BACKEND_URL = "http://localhost:4000/api/order/place";
const ESEWA_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

function PlaceOrder() {
  const { cart, username } = useContext(StoreContext);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const secretKey = "8gBm/:&EnhH.1/q";
  const deliveryCharge = 50;

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return (
      Object.values(cart).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ) + deliveryCharge
    );
  }, [cart]);

  // eSewa payment data
  const [data, setData] = useState({
    amount: totalAmount.toString(),
    tax_amount: "0",
    total_amount: totalAmount.toString(),
    transaction_uuid: uuidv4(),
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: "http://localhost:5173/paymentsuccess",
    failure_url: "http://localhost:5173/paymentfailure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
  });

  // Generate HMAC signature
  useEffect(() => {
    generateSignature();
  }, [totalAmount, data.transaction_uuid]);

  const generateSignature = () => {
    const signatureString = `total_amount=${totalAmount},transaction_uuid=${data.transaction_uuid},product_code=${data.product_code}`;
    const hash = CryptoJS.HmacSHA256(signatureString, secretKey);
    const signature = CryptoJS.enc.Base64.stringify(hash);
    setData((prevData) => ({ ...prevData, signature, total_amount: totalAmount.toString() }));
  };

  // Handle Order Submission
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!address || !username || Object.keys(cart).length === 0) {
      alert("Please fill all fields and add items to cart.");
      return;
    }
  
    // Attach address and phone to data object (so we can use it later in PaymentSuccess)
    localStorage.setItem("phone",phone);
    localStorage.setItem("address",address)
  
    // Submit to eSewa
    document.getElementById("esewaForm").submit();
  };
  

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Place Order</h2>
      <form onSubmit={handleSubmit}>
        <label className="block font-medium mb-1">Delivery Address</label>
        <input
          type="text"
          className="border-2 border-black w-full p-2 mb-3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <label className="block font-medium mb-1">Phone</label>
        <input
          type="text"
          className="border-2 border-black w-full p-2 mb-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <h3 className="font-semibold mt-4">Order Summary</h3>
        <ul className="border p-3 rounded-md mb-4">
          {Object.values(cart).map((item, index) => (
            <li key={index} className="flex justify-between py-2">
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>Rs {item.price * item.quantity}</span>
            </li>
          ))}
          <li className="flex justify-between font-semibold pt-3 border-t">
            <span>Delivery Charge</span>
            <span>Rs {deliveryCharge}</span>
          </li>
          <li className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rs {totalAmount}</span>
          </li>
        </ul>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Proceed to Payment
        </button>
      </form>

      {/* eSewa Payment Form */}
      <form id="esewaForm" action={ESEWA_URL} method="POST" hidden>
        {Object.entries(data).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} readOnly />
        ))}
      </form>
    </div>
  );
}

export default PlaceOrder;
