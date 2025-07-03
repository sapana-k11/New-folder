import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBox, FaList, FaClipboardList, FaAngleDoubleRight } from "react-icons/fa";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`h-auto border-r border-black transition-all duration-[800ms] ease-in-out ${
        isOpen ? "w-48" : "w-20"
      }`}
    >
      {/* Toggle Button */}
      <div className={`flex p-2 absolute left-12 text-teal-50 transition-all duration-[800ms] ease-in-out ${isOpen?"left-36":""}`}>
        <button onClick={() => setIsOpen(!isOpen)}>
          <FaAngleDoubleRight className={`text-2xl transition-all duration-[800ms] ease-in-out ${isOpen?"rotate-180":""}`} />
        </button>
      </div>

      <div className="flex flex-col py-10 gap-6 px-4 w-fit text-teal-50">
        <Link
          to="/admin/add"
          className="flex items-center gap-3 cursor-pointer hover:text-blue-500"
        >
          <FaBox />
          {isOpen && <span>Add Product</span>}
        </Link>

        <Link
          to="/admin/products"
          className="flex items-center gap-3 cursor-pointer hover:text-blue-500"
        >
          <FaList />
          {isOpen && <span>List Product</span>}
        </Link>

        <Link
          to="/admin/order"
          className="flex items-center gap-3 cursor-pointer hover:text-blue-500"
        >
          <FaClipboardList />
          {isOpen && <span>Orders</span>}
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
