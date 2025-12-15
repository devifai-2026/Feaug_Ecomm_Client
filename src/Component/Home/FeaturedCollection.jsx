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
import { BsArrowsAngleExpand, BsCurrencyRupee, BsHeart, BsShare, BsHeartFill } from 'react-icons/bs';
import { FaArrowRightLong } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useWishlist } from '../Context/WishlistContext';
import { useCart } from '../Context/CartContext';

const FeaturedCollection = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const navigate = useNavigate();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();

    const products = [
        { 
            id: 1, 
            title: "Diamond Necklace", 
            price: 299.99, 
            image: one, 
            angleImage: oneAngle, 
            discount: null,
            description: "Beautiful diamond necklace",
            rating: 4.5
        },
        { 
            id: 2, 
            title: "Gold Earrings", 
            price: 199.99, 
            image: two, 
            angleImage: twoAngle, 
            discount: null,
            description: "Elegant gold earrings",
            rating: 4.2
        },
        { 
            id: 3, 
            title: "Silver Bracelet", 
            price: 149.99, 
            image: three, 
            angleImage: threeAngle, 
            discount: "-10% off",
            description: "Stylish silver bracelet",
            rating: 4.8
        },
        { 
            id: 4, 
            title: "Pearl Necklace", 
            price: 399.99, 
            originalPrice: 499.99,
            image: four, 
            angleImage: fourAngle, 
            discount: "-20% off",
            description: "Classic pearl necklace",
            rating: 4.7
        },
        { 
            id: 5, 
            title: "Ruby Ring", 
            price: 599.99, 
            originalPrice: 799.99,
            image: five, 
            angleImage: fiveAngle, 
            discount: "-25% off",
            description: "Gorgeous ruby ring",
            rating: 4.9
        },
        { 
            id: 6, 
            title: "Emerald Pendant", 
            price: 349.99, 
            image: six, 
            angleImage: sixAngle, 
            discount: null,
            description: "Stunning emerald pendant",
            rating: 4.6
        },
        { 
            id: 7, 
            title: "Sapphire Earrings", 
            price: 299.99, 
            image: seven, 
            angleImage: sevenAngle, 
            discount: "-15% off",
            description: "Beautiful sapphire earrings",
            rating: 4.4
        },
        { 
            id: 8, 
            title: "Platinum Ring", 
            price: 899.99, 
            image: eight, 
            angleImage: eightAngle, 
            discount: null,
            description: "Elegant platinum ring",
            rating: 4.8
        }
    ];

    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = (product, e) => {
        e.stopPropagation();
        
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            description: product.description,
            discount: product.discount,
            rating: product.rating
        }, 1);
        
        toast.success(
            <div>
                <p className="font-semibold">Added to cart!</p>
                <p className="text-sm">{product.title}</p>
            </div>,
            {
                icon: '🛒',
                duration: 3000,
                style: {
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                },
            }
        );
    };

    const handleWishlistClick = (product, e) => {
        e.stopPropagation();
        
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
            toast.custom((t) => (
                <div className="animate-slideInRight max-w-md w-full bg-white shadow-lg flex border border-gray-200">
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <BsHeartFill className="h-6 w-6 text-red-500" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    Removed from wishlist
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    {product.title} has been removed
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-gray-200">
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                navigate('/wishlist');
                            }}
                            className="w-full border border-transparent p-4 flex items-center justify-center text-sm font-medium text-pink-600 hover:text-pink-500 transition-colors"
                        >
                            View Wishlist
                        </button>
                    </div>
                </div>
            ), {
                duration: 4000,
            });
        } else {
            addToWishlist({
                id: product.id,
                title: product.title,
                price: product.price,
                originalPrice: product.originalPrice || product.price,
                image: product.image,
                angleImage: product.angleImage,
                discount: product.discount,
                description: product.description,
                rating: product.rating,
                inStock: true
            });
            
            toast.success(
                <div>
                    <p className="font-semibold">Added to wishlist!</p>
                    <p className="text-sm">{product.title}</p>
                </div>,
                {
                    icon: '❤️',
                    duration: 3000,
                    style: {
                        background: '#fff5f5',
                        border: '1px solid #fca5a5',
                    },
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                    },
                }
            );
        }
    };

    const handleViewWishlist = () => {
        navigate('/wishlist');
    };

    const handleViewMore = () => {
        navigate('/products');
    };

    return (
        <div className='mt-16 max-w-[90%] mx-auto'>
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                    },
                }}
            />

            <style jsx>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeDown {
                    from {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes zoomIn {
                    from {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                .animate-slideInRight {
                    animation: slideInRight 0.3s ease-out;
                }
                
                .animate-fadeDown {
                    animation: fadeDown 0.5s ease-out;
                }
                
                .animate-fadeUp {
                    animation: fadeUp 0.5s ease-out;
                }
                
                .animate-zoomIn {
                    animation: zoomIn 0.5s ease-out;
                }
            `}</style>

            <div className='flex items-center justify-between mb-10'>
                <h2 
                    className='text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 animate-fadeDown'
                >
                    Featured Collection
                </h2>
                <div className="flex items-center gap-4">
                   
                    <button 
                        onClick={handleViewMore}
                        className='text-nowrap flex items-center gap-2 cursor-pointer hover:gap-3 transition-all duration-300 animate-fadeDown group text-gray-600 hover:text-gray-900'
                    >
                        View More 
                        <FaArrowRightLong className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
            
            {/* Products Grid */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                {products.map((product, index) => {
                    const isInWishlistItem = isInWishlist(product.id);
                    
                    return (
                        <div 
                            key={product.id}
                            className='relative overflow-hidden group cursor-pointer bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 animate-fadeUp'
                            style={{ animationDelay: `${(index % 4) * 0.1 + 0.2}s` }}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => handleCardClick(product.id)} 
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
                                        className='absolute top-3 left-3 bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 text-sm font-bold z-10 animate-zoomIn'
                                        style={{ animationDelay: '0.5s' }}
                                    >
                                        {product.discount}
                                    </div>
                                )}
                                
                                {/* Hover Icons */}
                                {/* Mobile & Tablet: Always visible */}
                                <div className='lg:hidden absolute top-3 right-3 flex flex-col gap-2 z-10'>
                                    <button 
                                        className={`p-2 shadow-lg transition-all duration-300 hover:scale-110 ${
                                            isInWishlistItem 
                                                ? 'bg-red-50 text-red-500' 
                                                : 'bg-white text-gray-700 rounded-full hover:bg-red-50 hover:text-red-500'
                                        }`}
                                        onClick={(e) => handleWishlistClick(product, e)}
                                        title={isInWishlistItem ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        {isInWishlistItem ? (
                                            <BsHeartFill className='text-lg' />
                                        ) : (
                                            <BsHeart className='text-lg' />
                                        )}
                                    </button>
                                    <button 
                                        className='bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors hover:scale-110'
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <BsShare className='text-gray-700 hover:text-blue-500' />
                                    </button>
                                    <button 
                                        className='bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors hover:scale-110'
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
                                        className={`p-2 shadow-lg transition-all duration-300 hover:scale-110 ${
                                            isInWishlistItem 
                                                ? 'bg-red-50 text-red-500' 
                                                : 'bg-white text-gray-700 rounded-full hover:bg-red-50 hover:text-red-500'
                                        }`}
                                        onClick={(e) => handleWishlistClick(product, e)}
                                        title={isInWishlistItem ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        {isInWishlistItem ? (
                                            <BsHeartFill className='text-lg' />
                                        ) : (
                                            <BsHeart className='text-lg' />
                                        )}
                                    </button>
                                    <button 
                                        className='bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors hover:scale-110'
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <BsShare className='text-gray-700 hover:text-blue-500' />
                                    </button>
                                    <button 
                                        className='bg-white p-2 shadow-lg rounded-full hover:bg-gray-100 transition-colors hover:scale-110'
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <BsArrowsAngleExpand className='text-gray-700' />
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                {/* Mobile & Tablet: Always visible */}
                                <button 
                                    className='lg:hidden absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-600 py-2 px-6 transition-all duration-300 w-[90%] hover:scale-105 uppercase tracking-wide text-sm text-nowrap z-10 font-semibold shadow-md hover:bg-gray-50 border border-gray-200'
                                    onClick={(e) => handleAddToCart(product, e)}
                                >
                                    Add to Cart
                                </button>
                                
                                {/* Desktop: Show on hover */}
                                <button 
                                    className={`hidden lg:block absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-600 py-2 px-6 transition-all duration-300 w-[90%] hover:scale-105 uppercase tracking-widest z-10 font-semibold shadow-md hover:bg-gray-50 border border-gray-200 ${
                                        hoveredCard === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                    }`}
                                    onClick={(e) => handleAddToCart(product, e)}
                                >
                                    Add to Cart
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className='mt-3 p-4 border-t border-gray-100'>
                                <h2 
                                    className='text-lg font-semibold mb-1 group-hover:text-gray-900 transition-colors animate-fadeUp line-clamp-1'
                                    style={{ animationDelay: '0.3s' }}
                                >
                                    {product.title}
                                </h2>
                                <div className="flex items-center justify-between">
                                    <p 
                                        className='flex items-center gap-1 text-gray-500 font-medium text-lg animate-fadeUp'
                                        style={{ animationDelay: '0.4s' }}
                                    >
                                       <BsCurrencyRupee />
                                        {product.price}
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span className="text-sm text-gray-400 line-through ml-2">
                                                <BsCurrencyRupee className="inline" />
                                                {product.originalPrice}
                                            </span>
                                        )}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-sm text-gray-600">{product.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FeaturedCollection;