import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../Context/StoreContext";
import {toast} from "react-toastify"
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

const Login = () => {
  const url = "http://localhost:4000/api/user";
  const navigate = useNavigate();
  const { setToken, setUsername } = useContext(StoreContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (email === "admin@gmail.com" && password === "admin123456789") {
      navigate("/admin");
      return;
    }

    try {
      const response = await axios.post(`${url}/login`, { email, password });

      if (response.data.success) {
        const { token, username } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        setToken(token);
        setUsername(username);
        toast.success("Login Successful")
        navigate("/");
      } else {
        setError("Credentials Doesn't match");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#5c7c89]">
      <div className="bg-white text-black p-8 rounded-lg shadow-lg w-90">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              required
            />
            <span
              className="absolute right-3 top-9 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="flex justify-between text-sm text-blue-950">
            <Link to="/register" className="underline">
              Dont have an account? Register
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 mt-4"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
