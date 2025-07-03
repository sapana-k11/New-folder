import { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import {toast} from "react-toastify"

const Register = () => {
  const url = "http://localhost:4000/api/user";
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (name === "admin") {
      setError("Username can't be admin");
      return;
    }
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if(password.length<8){
      setError("Password Should be at least 8 characters long")
      return;
    }
    if(!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)    ){
      setError("Please enter proper email")
      return;
    }
    if (/\d/.test(name)) {
      setError("Name cannot contain numbers");
      return;
  }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`${url}/register`, { name, email, password });
      if (response.data.success) {
        setSuccess("Registration successful!");
        navigate("/login");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
       toast.success("Registration Successful")
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.",err);
    }
  };

  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-90 p-4 border border-gray-300 rounded-lg shadow-md text-black bg-white">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-500 mb-2">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Enter your name" required />
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" required />
          </div>
          <div className="relative">
            <label className="block mb-2">Password</label>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Enter your password" required/>
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-600">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative">
            <label className="block mb-2">Confirm Password</label>
            <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Confirm your password" required/>
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10 text-gray-600">
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <Link to="/login" className="text-blue-950 underline text-xs">Already have an account? click here</Link>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
