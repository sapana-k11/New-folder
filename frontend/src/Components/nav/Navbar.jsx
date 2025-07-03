import { NavLink } from "react-router-dom";
import { miscImages } from "../../assets/assets";
import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../Context/StoreContext";

function Navbar() {
  const { token, username, setToken, setUsername } = useContext(StoreContext);
  const [showMenu, setShowMenu] = useState(false);

  // Function to handle logout
  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setShowMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu")) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="text-white bg-[#1f4959] flex justify-between px-15 items-center relative">
      <span>
        <NavLink to="/">
          <img src={miscImages.logo} className="w-20 py-1" alt="Logo" />
        </NavLink>
      </span>
      <div>
        <ul className="flex gap-3 p-3">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "text-cyan-600" : ""}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? "text-cyan-600" : ""}>About</NavLink>
          </li>
          <li>
            <NavLink to="/personalisation" className={({ isActive }) => isActive ? "text-cyan-600" : ""}>Personalisation</NavLink>
          </li>
        </ul>
      </div>
      <div className="relative">
        {!token ? (
          <button className="bg-[#011425] px-5 py-2.5 rounded-tl-2xl cursor-pointer">
            <NavLink to="/login">Login</NavLink>
          </button>
        ) : (
          <div className="relative user-menu">
            <div 
              className="text-white font-semibold uppercase cursor-pointer bg-gray-700 px-4 py-2 rounded-lg"
              onClick={() => setShowMenu(!showMenu)}
            >
              {username ? username.substring(0, 2) : "NA"}
            </div>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-lg p-2 z-50">
                <NavLink to="/cart" className="block px-4 py-2 hover:bg-gray-200">Cart</NavLink>
                <NavLink to="/userorder" className="block px-4 py-2 hover:bg-gray-200">Your Orders</NavLink>
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
