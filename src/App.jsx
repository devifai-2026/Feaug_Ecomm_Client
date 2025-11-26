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

function App() {

  useEffect(() => {
  
    AOS.init({
      duration: 1000, 
      once: false, 
      offset: 100, 
      easing: 'ease-in-out', 
    });


    const interval = setInterval(() => {
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
    },  10000); 


    return () => clearInterval(interval);
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
        </Route>
      </Routes>
    </>
  )
}

export default App