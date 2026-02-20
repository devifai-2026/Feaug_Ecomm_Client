import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Layout from "./Component/Layout/Layout";
import Home from "./Component/Home/Home";
import { useEffect } from "react";
import usePageTracking from "./hooks/usePageTracking";

// Import AOS
import AOS from "aos";
import "aos/dist/aos.css";

// Import Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from "./Component/Home/ProductDetails/ProductDetails";
import Category from "./Component/Category/Category";
import About from "./Component/Pages/About";
import Contact from "./Component/Pages/Contact";
import Wishlist from "./Component/Pages/Wishlist/Wishlist";
import Cart from "./Component/Pages/Cart/Cart";
import Register from "./Component/Pages/Register/Register";
import Login from "./Component/Pages/Login/Login";
import ForgotPassword from "./Component/Pages/Login/ForgotPassword";
import Checkout from "./Component/Pages/Cart/Checkout";
import HelpCenter from "./Component/Pages/Footer/HelpCenter";
import PrivacyPolicy from "./Component/Pages/Footer/PrivacyPolicy";
import ReturnPolicy from "./Component/Pages/Footer/ReturnPolicy";
import Testimonials from "./Component/Pages/Footer/Testimonials";
import TermsCondition from "./Component/Pages/Footer/TermsCondition";
import MyProfile from "./Component/Pages/MyProfile/MyProfile";
import MyOrders from "./Component/Pages/MyOrders/MyOrders";
import OrderDetails from "./Component/Pages/MyOrders/OrderDetails";
import PaymentStatus from "./Component/Pages/Payment/PaymentStatus";
import productApi from "./apis/productApi";

function App() {
  usePageTracking();
  const location = useLocation();

  useEffect(() => {
  const skipToastPaths = ["/login", "/register"];
  if (skipToastPaths.includes(location.pathname)) return;
  AOS.init({
    duration: 800,
    once: true,
    offset: 120,
    easing: "ease-out",
    disable: window.innerWidth < 768,
  });

  setTimeout(() => {
    AOS.refresh();
  }, 100);

  let activityInterval;

  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchAndShowActivity = async () => {
    let activityData = [];
    let userNames = [];

    try {
      const productsRes = await productApi.getAllProducts({ params: {} });
      if (productsRes?.data?.products?.length > 0) {
        activityData = productsRes.data.products.map((p) => ({
          product: p.name,
          image: p.images?.[0]?.url || p.image || null,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch products for activity:", err);
    }

    userNames = shuffleArray([
      "Aarav Sharma",
      "Vivaan Patel",
      "Aditya Singh",
      "Arjun Verma",
      "Ishaan Mehta",
      "Kabir Gupta",
      "Rohan Nair",
      "Rahul Yadav",
      "Siddharth Jain",
      "Manish Kumar",
      "Ananya Reddy",
      "Diya Kapoor",
      "Priya Sharma",
      "Sneha Iyer",
      "Kavya Menon",
      "Neha Joshi",
      "Aditi Rao",
      "Pooja Desai",
      "Meera Kulkarni",
      "Ritika Choudhary",
    ]);

    if (!activityData.length || !userNames.length) return;

    let nameIndex = 0;

    const showNextToast = () => {
      const randomActivity =
        activityData[Math.floor(Math.random() * activityData.length)];

      if (nameIndex >= userNames.length) {
        userNames = shuffleArray(userNames);
        nameIndex = 0;
      }

      const userName = userNames[nameIndex++];

      const ToastContent = () => (
        <div className="flex items-center gap-3">
          {randomActivity.image ? (
            <img
              src={randomActivity.image}
              alt={randomActivity.product}
              className="w-10 h-10 object-cover rounded-md"
            />
          ) : (
            <div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center text-purple-600 font-bold">
              {userName.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              bought {randomActivity.product}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Just now
            </p>
          </div>
        </div>
      );

      toast(<ToastContent />);
    };

    // 🔥 Show immediately
    showNextToast();

    // 🔁 Then repeat every 5 seconds
    activityInterval = setInterval(showNextToast, 25000);
  };

  fetchAndShowActivity();

  return () => {
    if (activityInterval) clearInterval(activityInterval);
  };
}, [location.pathname]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!rounded-xl !shadow-lg border border-gray-100 !p-4"
        bodyClassName="!p-0"
        toastStyle={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(4px)",
        }}
      />

      <Routes>
        <Route path="/" element={<Layout></Layout>}>
          <Route index element={<Home></Home>}></Route>
          <Route path="product/:id" element={<ProductDetails />}></Route>
          <Route path="categories" element={<Category />}></Route>
          <Route path="about" element={<About />}></Route>
          <Route path="contact" element={<Contact />}></Route>
          <Route path="wishlist" element={<Wishlist />}></Route>
          <Route path="cart" element={<Cart />}></Route>
          <Route path="checkout" element={<Checkout />}></Route>
          <Route path="register" element={<Register />}></Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="forgotPassword" element={<ForgotPassword />}></Route>
          <Route path="helpCenter" element={<HelpCenter />}></Route>
          <Route path="privacyPolicy" element={<PrivacyPolicy />}></Route>
          <Route path="returnPolicy" element={<ReturnPolicy />}></Route>
          <Route path="testimonials" element={<Testimonials />}></Route>
          <Route path="terms-condition" element={<TermsCondition />}></Route>
          <Route path="myProfile" element={<MyProfile />}></Route>
          <Route path="myOrders" element={<MyOrders />}></Route>
          <Route
            path="orderDetails/:orderId"
            element={<OrderDetails />}
          ></Route>
          <Route path="payment-status" element={<PaymentStatus />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
