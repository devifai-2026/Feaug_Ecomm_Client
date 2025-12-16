import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './Component/Layout/Layout'
import Home from './Component/Home/Home'
import { useEffect } from 'react'

// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetails from './Component/Home/ProductDetails/ProductDetails'
import Category from './Component/Category/Category'
import About from './Component/Pages/About'
import Contact from './Component/Pages/Contact'
import Wishlist from './Component/Pages/Wishlist/Wishlist'
import Cart from './Component/Pages/Cart/Cart'
import Register from './Component/Pages/Register/Register'
import Login from './Component/Pages/Login/Login'
import ForgotPassword from './Component/Pages/Login/ForgotPassword'
import Checkout from './Component/Pages/Cart/Checkout'

function App() {

  useEffect(() => {
  
    // Initialize AOS with better settings to prevent layout shift
   AOS.init({
  duration: 800,
  once: true,
  offset: 120,
  easing: 'ease-out',
  disable: window.innerWidth < 768, // Disable on mobile
});

    // Refresh AOS after page load to ensure proper initialization
    setTimeout(() => {
      AOS.refresh();
    }, 100);

    const showToast = () => {
      toast.success('Subhojit Dutta purchased necklace!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      
      setTimeout(showToast, 4 * 60 * 1000);
    };

    const timeoutId = setTimeout(showToast, 4 * 60 * 1000);

    return () => clearTimeout(timeoutId);
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
        </Route>
      </Routes>
    </>
  )
}

export default App