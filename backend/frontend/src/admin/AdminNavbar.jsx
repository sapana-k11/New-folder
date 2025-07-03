import { useState } from "react";
import { miscImages } from "../assets/assets";
import { useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="flex justify-between px-5 py-3 items-center ">
      <div className="flex flex-col gap-2">
        <img src={miscImages.logo} alt="logo" className="h-15 w-20" />
        <span className="text-l font-bold text-teal-50">Admin Dashboard</span>
      </div>

      <span className="relative">
        <span
          onClick={() => setShowLogout(!showLogout)}
          className="cursor-pointer"
        >
          <img src={miscImages.adminImage} alt="admin" className="h-15" />
        </span>

        {showLogout && (
          <button
            className="absolute left-1/2 top-full mt-2 w-24 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out opacity-100 scale-100 hover:bg-red-600"
            onClick={() => navigate("/")}
          >
            LogOut
          </button>
        )}
      </span>
    </div>
  );
}

export default AdminNavbar;
