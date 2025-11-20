import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './Component/Layout/Layout'
import Home from './Component/Home/Home'
import { useEffect } from 'react'

// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css';
import ProductDetails from './Component/Home/ProductDetails/ProductDetails'

function App() {

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000, 
      once: false, 
      offset: 100, 
      easing: 'ease-in-out', 
    });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout></Layout>}>
          <Route index element={<Home></Home>}></Route>
          <Route path="product/:id" element={<ProductDetails />}></Route> 
        </Route>
      </Routes>
    </>
  )
}

export default App