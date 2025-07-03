import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Home from "../../Pages/Home";
import About from "../../Pages/About";
import Personalisation from "../../Pages/Personalisation";
import Navbar from "../nav/Navbar";
import Footer from "../Footer/Footer";
import Login from "../login/Login";
import Register from "../login/Register";
import Product from "../../Pages/Product";
import Sidebar from "../../admin/Sidebar";
import AddItems from "../../admin/Pages/addItems";
import OrderList from "../../admin/Pages/orderList";
import ProductList from "../../admin/Pages/ProductList";
import AdminNavbar from "../../admin/AdminNavbar";
import Cart from "../../Pages/Cart";
import PlaceOrder from "../../Pages/PlaceOrder";
import UserOrder from "../../Pages/UserOrder";
import Protected from "../Protected";
import PaymentSuccess from "../../Pages/PaymentSuccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    ),
    children: [
      { path: "/", element: <Home /> },
      {
        path: "paymentsuccess",
        element: <PaymentSuccess/>
      },
      {
        path: "paymentfailure",
        element: (
          <div className="text-center text-5xl">
            <p>Payment Failed❌</p>
            <Link to={"/order"} ><span className="hover:text-blue-950">Try Again</span></Link>
          </div>
        ),
      },
      {
        path: "/cart",
        element: (
          <>
            <Protected>
              <Cart />
            </Protected>
          </>
        ),
      },
      {
        path: "/order",
        element: (
          <>
            <Protected>
              <PlaceOrder />
            </Protected>
          </>
        ),
      },
      { path: "/userorder", element: <UserOrder /> },
      { path: "/product/:id", element: <Product /> },
      { path: "/about", element: <About /> },
      { path: "/personalisation", element: <Personalisation /> },
      {
        path: "*",
        element: (
          <Link to={"/"} className="text-blue-900">
            Not Found
          </Link>
        ),
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // ✅ Admin Routes handled inside the main Routes file
  {
    path: "/admin",
    element: (
      <div>
        <AdminNavbar />
        <hr />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-4">
            <Outlet />
          </div>
        </div>
      </div>
    ),
    children: [
      { path: "products", element: <ProductList /> },
      { path: "order", element: <OrderList /> },
      { path: "add", element: <AddItems /> },
    ],
  },
]);

function Routes() {
  return <RouterProvider router={router} />;
}

export default Routes;
