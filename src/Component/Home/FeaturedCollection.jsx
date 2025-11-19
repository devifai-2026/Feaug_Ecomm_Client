import React, { useState } from 'react';
import img from "../../assets/Features/freepik__portrait-of-a-girl-with-sparkling-jewelry-radiant-__27577.png"
import { BsArrowsAngleExpand, BsCurrencyDollar, BsHeart, BsShare } from 'react-icons/bs';
import { FaArrowRightLong } from 'react-icons/fa6';

const FeaturedCollection = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    // Mock data for 8 products (2 rows of 4) with discount info
    const products = [
        { title: "Diamond Necklace", price: 299.99, image: img, discount: null },
        { title: "Diamond Necklace", price: 299.99, image: img, discount: null },
        { title: "Diamond Necklace", price: 299.99, image: img, discount: null },
        { title: "Diamond Necklace", price: 299.99, image: img, discount: "-20% off" },
        { title: "Diamond Necklace", price: 299.99, image: img, discount: null },
        { title: "Diamond Necklace", price: 299.99, image: img, discount: "-50% off" },
        { title: "Diamond Necklace", price: 299.99, image: img, discount: null },
        { title: "Diamond Necklace", price: 299.99, image: img, discount: null }
    ];

    return (
        <div className='mt-16 max-w-[90%] mx-auto'>
            <div className='flex items-center justify-between mb-10'>
                <h2 className='text-3xl font-bold text-gray-500'>Featured Collection</h2>
                <p className='flex items-center gap-2 cursor-pointer hover:gap-3 transition-all duration-300'>
                    View More <FaArrowRightLong />
                </p>
            </div>
            
            {/* Products Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {products.map((product, index) => (
                    <div 
                        key={index}
                        className='relative overflow-hidden group cursor-pointer'
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        {/* Image Container */}
                        <div className='relative overflow-hidden'>
                            <img 
                                className='w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110' 
                                src={product.image} 
                                alt={product.title} 
                            />
                            
                            {/* Discount Badge - Top Left (only for cards 4 and 6) */}
                            {product.discount && (
                                <div className='absolute top-3 left-3 bg-brown text-white px-3 py-1 font-semibold bg-orange-950'>
                                    {product.discount}
                                </div>
                            )}
                            
                            {/* Hover Icons - Top Right */}
                            <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${hoveredCard === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                                <button className='bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors'>
                                    <BsHeart className='text-gray-700 hover:text-red-500' />
                                </button>
                                <button className='bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors'>
                                    <BsShare className='text-gray-700 hover:text-blue-500' />
                                </button>
                                <button className='bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors'>
                                    <BsArrowsAngleExpand className='text-gray-700' />
                                </button>
                            </div>

                            {/* Add to Cart Button - Bottom of Image */}
                            <button className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-600 py-2 px-6 transition-all duration-300 ${hoveredCard === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                Add to Cart
                            </button>
                        </div>

                        {/* Product Info */}
                        <div className=''>
                            <h2 className='text-lg font-semibold mb-1'>{product.title}</h2>
                            <p className='flex items-center gap-1 text-gray-500 font-medium text-lg'>
                                <BsCurrencyDollar />
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