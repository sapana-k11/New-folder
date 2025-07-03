import { useContext } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { StoreContext } from "./Context/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Protected({ children }) {
  const { token } = useContext(StoreContext);
  const navigate = useNavigate();

  if (!token) {
    toast.error("Login first to access this page");
    navigate("/login");
    return null; // Prevents rendering children before navigation
  }

  return <>{children}</>;
}

// ✅ PropTypes validation
Protected.propTypes = {
  children: PropTypes.node,
};

export default Protected;
