import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Component/Layout/Layout";
import Home from "./Component/Home/Home";
import { useEffect } from "react";

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
import orderApi from "./apis/orderApi";

function App() {
  useEffect(() => {
    // Initialize AOS
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

    // Recent purchase notification logic
    // let activityInterval;

    // const fetchAndShowActivity = () => {
    //   orderApi.getRecentActivity({
    //     onSuccess: (response) => {
    //       if (response && response.data && response.data.length > 0) {
    //         // Function to show random purchase toast
    //         const showRandomToast = () => {
    //           const randomOrder = response.data[Math.floor(Math.random() * response.data.length)];

    //           // Custom content for the toast
    //           const ToastContent = () => (
    //             <div className="flex items-center gap-3">
    //               {randomOrder.image ? (
    //                 <img
    //                   src={randomOrder.image}
    //                   alt={randomOrder.product}
    //                   className="w-10 h-10 object-cover rounded-md"
    //                 />
    //               ) : (
    //                 <div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center text-purple-600 font-bold">
    //                   {randomOrder.user.charAt(0)}
    //                 </div>
    //               )}
    //               <div className="flex-1 min-w-0">
    //                 <p className="text-sm font-medium text-gray-900 truncate">
    //                   {randomOrder.user}
    //                 </p>
    //                 <p className="text-xs text-gray-500 truncate">
    //                   bought {randomOrder.product}
    //                 </p>
    //                 <p className="text-[10px] text-gray-400 mt-0.5">
    //                   {randomOrder.city} • Just now
    //                 </p>
    //               </div>
    //             </div>
    //           );

    //           toast(<ToastContent />, {
    //             position: "bottom-left",
    //             autoClose: 5000,
    //             hideProgressBar: true,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             className: "!rounded-xl !shadow-lg border border-gray-100",
    //             bodyClassName: "!p-0",
    //             style: { background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(4px)" }
    //           });

    //           // Schedule next toast (random time between 15-30 seconds)
    //           const nextTime = Math.random() * (30000 - 15000) + 15000;
    //           activityInterval = setTimeout(showRandomToast, nextTime);
    //         };

    //         // Start showing toasts after initial delay
    //         activityInterval = setTimeout(showRandomToast, 10000);
    //       }
    //     },
    //     onError: (err) => {
    //       console.error("Failed to fetch recent activity:", err);
    //     }
    //   });
    // };

    // fetchAndShowActivity();

    // return () => {
    //   if (activityInterval) clearTimeout(activityInterval);
    // };
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
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
