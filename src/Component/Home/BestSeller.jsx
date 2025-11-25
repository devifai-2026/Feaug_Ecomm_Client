import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sale from "../../assets/BestSeller/left.jpeg";
import one from "../../assets/BestSeller/one.webp";
import two from "../../assets/BestSeller/two.webp";
import three from "../../assets/BestSeller/three.webp";
import { BsHeart, BsShare, BsArrowsAngleExpand, BsCurrencyRupee } from 'react-icons/bs';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const BestSeller = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const products = [
    { 
      id: 1,
      title: "Arch Pendant Necklace", 
      price: 149.99, 
      originalPrice: null,
      image: one 
    },
    { 
      id: 2,
      title: "Golden Pearls Bracelet", 
      price: 89.99, 
      originalPrice: 103.40,
      image: two 
    },
    { 
      id: 3,
      title: "Diamond Engagement Ring", 
      price: 799.99, 
      originalPrice: null,
      image: three 
    },
    { 
      id: 4,
      title: "Silver Chain Necklace", 
      price: 129.99, 
      originalPrice: null,
      image: two 
    },
    { 
      id: 5,
      title: "Ruby Earrings", 
      price: 199.99, 
      originalPrice: 249.99,
      image: three 
    },
    { 
      id: 6,
      title: "Pearl Drop Earrings", 
      price: 159.99, 
      originalPrice: null,
      image: one 
    },
    { 
      id: 7,
      title: "Gold Plated Bracelet", 
      price: 69.99, 
      originalPrice: 89.99,
      image: two 
    },
    { 
      id: 8,
      title: "Sapphire Ring", 
      price: 299.99, 
      originalPrice: null,
      image: one 
    },
    { 
      id: 9,
      title: "Crystal Pendant", 
      price: 79.99, 
      originalPrice: 99.99,
      image: three 
    },
    { 
      id: 10,
      title: "Diamond Stud Earrings", 
      price: 349.99, 
      originalPrice: null,
      image: one 
    },
  ];

  const slidesPerPage = 3;
  const totalSlides = Math.ceil(products.length / slidesPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleProducts = products.slice(
    currentSlide * slidesPerPage,
    (currentSlide + 1) * slidesPerPage
  );

  // Handle card click to navigate to details page
  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Handle expand icon click (same as card click)
  const handleExpandClick = (productId, e) => {
    e.stopPropagation(); // Prevent card click from triggering
    navigate(`/product/${productId}`);
  };

  // Refresh AOS when slide changes
  useEffect(() => {
    AOS.refresh();
  }, [currentSlide]);

  return (
    <div className="mt-16 max-w-[90%] mx-auto overflow-hidden">
      <div className="mb-10">
        <hr />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-2">
        {/* Seasonal Sale */}
        <div className="w-full lg:w-1/3">
          <div className="relative">
            <img 
              className="w-full h-[500px] object-cover" 
              src={sale} 
              alt="Seasonal Sale" 
              data-aos="fade-right"
              data-aos-delay="200"
            />
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white text-center space-y-4">
              <p className="text-lg font-semibold">SALE</p>
              <p className="text-2xl font-bold">15%</p>
              <p className="text-xl font-bold">Seasonal Sale</p>
              <button className="border border-white px-6 py-2 hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
                SHOP NOW
              </button>
            </div>
          </div>
        </div>

        {/* Best Seller */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div data-aos="fade-down" data-aos-delay="300">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Best Seller</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Take a look at our best selling products that we have <br /> provided for your beauty and jewelry needs.
              </p>
            </div>
            
            {/* Slider Pagination */}
            <div className="flex items-center gap-4 mt-4 sm:mt-0" data-aos="fade-down" data-aos-delay="400">
              <button 
                onClick={prevSlide}
                className="w-10 h-10 flex items-center justify-center transition-colors"
              >
                <MdKeyboardArrowLeft />
              </button>
              <span className="text-sm font-medium">
                {currentSlide + 1}/{totalSlides}
              </span>
              <button 
                onClick={nextSlide}
                className="w-10 h-10 flex items-center justify-center transition-colors"
              >
               <MdKeyboardArrowRight />
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {visibleProducts.map((product, index) => (
              <div 
                key={product.id}
                className="relative overflow-hidden group cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleCardClick(product.id)}
                data-aos="fade-up"
                data-aos-delay={index * 100 + 500}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-100">
                  <img 
                    className="w-full h-80 object-cover transition-transform duration-500 lg:group-hover:scale-110" 
                    src={product.image} 
                    alt={product.title} 
                  />
                  
                  {/* Hover Icons - Mobile & Tablet: Always visible */}
                  <div className='lg:hidden absolute top-3 right-3 flex flex-col gap-2 z-10'>
                    <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                      <BsHeart className="text-gray-700 hover:text-red-500" />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                      <BsShare className="text-gray-700 hover:text-blue-500" />
                    </button>
                    <button 
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      onClick={(e) => handleExpandClick(product.id, e)}
                    >
                      <BsArrowsAngleExpand className="text-gray-700" />
                    </button>
                  </div>

                  {/* Hover Icons - Desktop: Show on hover */}
                  <div className={`hidden lg:flex absolute top-3 right-3 flex-col gap-2 transition-all duration-300 z-10 ${
                    hoveredCard === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}>
                    <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                      <BsHeart className="text-gray-700 hover:text-red-500" />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                      <BsShare className="text-gray-700 hover:text-blue-500" />
                    </button>
                    <button 
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      onClick={(e) => handleExpandClick(product.id, e)}
                    >
                      <BsArrowsAngleExpand className="text-gray-700" />
                    </button>
                  </div>

                  {/* Add to Cart Button - Mobile & Tablet: Always visible */}
                  <button className='lg:hidden absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-black w-[90%] py-3 px-3 text-sm font-medium transition-all duration-300 text-nowrap hover:scale-105 tracking-widest z-10'>
                    ADD TO CART
                  </button>

                  {/* Add to Cart Button - Desktop: Show on hover */}
                  <button className={`hidden lg:block absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-black w-[90%] py-3 px-3 text-sm font-medium transition-all duration-300 text-nowrap hover:scale-105 tracking-widest z-10 ${
                    hoveredCard === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    ADD TO CART
                  </button>
                </div>

                {/* Product Info */}
                <div className="mt-4">
                  <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                    hoveredCard === index ? 'text-orange-800' : 'text-gray-900'
                  }`}>
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {product.originalPrice ? (
                      <>
                        <span className="text-gray-600 font-bold flex items-center gap-1"><BsCurrencyRupee />{product.price}</span>
                        <span className="text-gray-400 line-through text-sm flex items-center gap-1"><BsCurrencyRupee />{product.originalPrice}</span>
                      </>
                    ) : (
                      <span className="text-gray-600 font-bold flex items-center gap-1"><BsCurrencyRupee />{product.price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <hr />
      </div>
    </div>
  );
};

export default BestSeller;