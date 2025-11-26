import React, { useState } from 'react';
import one from "../../assets/FeaturedCollection/one.webp"
import two from "../../assets/FeaturedCollection/two.png"
import three from "../../assets/FeaturedCollection/three.webp"
import four from "../../assets/FeaturedCollection/four.webp"
import five from "../../assets/FeaturedCollection/five.webp"
import six from "../../assets/FeaturedCollection/six.webp"
import seven from "../../assets/FeaturedCollection/seven.jpeg"
import eight from "../../assets/FeaturedCollection/eight.webp"
import oneAngle from "../../assets/FeaturedCollection/oneAngle.webp"
import twoAngle from "../../assets/FeaturedCollection/twoAngle.webp"
import threeAngle from "../../assets/FeaturedCollection/threeAngle.webp"
import fourAngle from "../../assets/FeaturedCollection/fiveAngle.jpg"
import fiveAngle from "../../assets/FeaturedCollection/fiveAngle.jpg"
import sixAngle from "../../assets/FeaturedCollection/sixAngle.avif"
import sevenAngle from "../../assets/FeaturedCollection/sevenAngle.webp"
import eightAngle from "../../assets/FeaturedCollection/eightAngle.webp"
import { BsArrowsAngleExpand, BsCurrencyRupee, BsHeart, BsShare } from 'react-icons/bs';
import { FaArrowRightLong } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom'; 

const FeaturedCollection = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const navigate = useNavigate(); 

    const products = [
        { id: 1, title: "Diamond Necklace", price: 299.99, image: one, angleImage: oneAngle, discount: null },
        { id: 2, title: "Diamond Necklace", price: 299.99, image: two, angleImage: twoAngle, discount: null },
        { id: 3, title: "Diamond Necklace", price: 299.99, image: three, angleImage: threeAngle, discount: null },
        { id: 4, title: "Diamond Necklace", price: 299.99, image: four, angleImage: fourAngle, discount: "-20% off" },
        { id: 5, title: "Diamond Necklace", price: 299.99, image: five, angleImage: fiveAngle, discount: null },
        { id: 6, title: "Diamond Necklace", price: 299.99, image: six, angleImage: sixAngle, discount: "-50% off" },
        { id: 7, title: "Diamond Necklace", price: 299.99, image: seven, angleImage: sevenAngle, discount: null },
        { id: 8, title: "Diamond Necklace", price: 299.99, image: eight, angleImage: eightAngle, discount: null }
    ];

    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className='mt-16 max-w-[90%] mx-auto'>
            <div className='flex items-center justify-between mb-10'>
                <h2 
                    className='text-xl md:text-2xl lg:text-3xl font-bold text-gray-500'
                    data-aos="fade-down"
                    data-aos-delay="100"
                >
                    Featured Collection
                </h2>
                <p 
                    className='text-nowrap flex items-center gap-2 cursor-pointer hover:gap-3 transition-all duration-300'
                    data-aos="fade-down"
                    data-aos-delay="100"
                >
                    View More <FaArrowRightLong />
                </p>
            </div>
            
            {/* Products Grid */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
                {products.map((product, index) => (
                    <div 
                        key={product.id}
                        className='relative overflow-hidden group cursor-pointer'
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={() => handleCardClick(product.id)} 
                        data-aos="fade-up"
                        data-aos-delay={(index % 4) * 100 + 200}
                        data-aos-duration="800"
                    >
                        {/* Image Container */}
                        <div className='relative overflow-hidden'>
                            {/* Main Image */}
                            <img 
                                className={`w-full h-72 object-cover transition-opacity duration-500 ${
                                    hoveredCard === index ? 'opacity-0' : 'opacity-100'
                                }`} 
                                src={product.image} 
                                alt={product.title} 
                            />
                            
                            {/* Angle Image - Shows on hover */}
                            <img 
                                className={`absolute top-0 left-0 w-full h-72 object-cover transition-opacity duration-500 ${
                                    hoveredCard === index ? 'opacity-100' : 'opacity-0'
                                }`} 
                                src={product.angleImage} 
                                alt={`${product.title} - alternate angle`} 
                            />
                            
                            {/* Discount Badge - Top Left */}
                            {product.discount && (
                                <div 
                                    className='absolute top-3 left-3 bg-brown text-white px-3 py-1 font-semibold bg-orange-950 z-10'
                                    data-aos="zoom-in"
                                    data-aos-delay="500"
                                >
                                    {product.discount}
                                </div>
                            )}
                            
                            {/* Hover Icons - Top Right */}
                            {/* Mobile & Tablet: Always visible */}
                            <div className='lg:hidden absolute top-3 right-3 flex flex-col gap-2 z-10'>
                                <button 
                                    className='bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors'
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <BsHeart className='text-gray-700 hover:text-red-500' />
                                </button>
                                <button 
                                    className='bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors'
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <BsShare className='text-gray-700 hover:text-blue-500' />
                                </button>
                                <button 
                                    className='bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors'
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <BsArrowsAngleExpand className='text-gray-700' />
                                </button>
                            </div>
                            
                            {/* Desktop: Show on hover */}
                            <div className={`hidden lg:flex absolute top-3 right-3 flex-col gap-2 transition-all duration-300 z-10 ${
                                hoveredCard === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                            }`}>
                                <button 
                                    className='bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors'
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <BsHeart className='text-gray-700 hover:text-red-500' />
                                </button>
                                <button 
                                    className='bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors'
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <BsShare className='text-gray-700 hover:text-blue-500' />
                                </button>
                                <button 
                                    className='bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors'
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <BsArrowsAngleExpand className='text-gray-700' />
                                </button>
                            </div>

                            {/* Add to Cart Button */}
                            {/* Mobile & Tablet: Always visible */}
                            <button 
                                className='lg:hidden absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-600 py-2 px-6 transition-all duration-300 w-[90%] hover:scale-105 uppercase tracking-wide text-sm text-nowrap z-10'
                                onClick={(e) => e.stopPropagation()}
                            >
                                Add to Cart
                            </button>
                            
                            {/* Desktop: Show on hover */}
                            <button 
                                className={`hidden lg:block absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-600 py-2 px-6 transition-all duration-300 w-[90%] hover:scale-105 uppercase tracking-widest z-10 ${
                                    hoveredCard === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                Add to Cart
                            </button>
                        </div>

                        {/* Product Info */}
                        <div className='mt-3'>
                            <h2 
                                className='text-lg font-semibold mb-1'
                                data-aos="fade-up"
                                data-aos-delay="300"
                            >
                                {product.title}
                            </h2>
                            <p 
                                className='flex items-center gap-1 text-gray-500 font-medium text-lg'
                                data-aos="fade-up"
                                data-aos-delay="400"
                            >
                               <BsCurrencyRupee />
                                {product.price}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedCollection;