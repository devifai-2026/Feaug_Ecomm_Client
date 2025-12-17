import React, { useEffect, useState } from 'react';
import { 
    BsCurrencyRupee, 
    BsTrash, 
    BsBag, 
    BsArrowLeft, 
    BsHeart 
} from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useWishlist } from '../../Context/WishlistContext';
import { useCart } from '../../context/CartContext';


const Wishlist = () => {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
       window.scrollTo(0, 0)
    },[]);
    
    const {
        wishlistItems,
        removeFromWishlist,
        clearWishlist
    } = useWishlist();

    // Add CartContext
    const { addToCart } = useCart();

    // Navigate to product page
    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
    };

    // Handle remove item with toast
    const handleRemoveItem = (id, e) => {
        e.stopPropagation();
        const itemToRemove = wishlistItems.find(item => item.id === id);
        removeFromWishlist(id);
        
        toast.custom((t) => (
            <div className={`animate-slideInRight max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <BsHeart className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                Removed from wishlist
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {itemToRemove?.title} has been removed
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex border-l border-gray-200">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        ));
    };

    // Handle move to cart with toast
    const handleMoveToCart = (item, e) => {
        e.stopPropagation();
        
        // Add item to cart
        addToCart({
            id: item.id,
            title: item.title,
            price: item.price,
            originalPrice: item.originalPrice || item.price,
            image: item.image,
            description: item.description,
            discount: item.discount,
            rating: item.rating,
            inStock: item.inStock
        }, 1);
        
        // Remove from wishlist
        removeFromWishlist(item.id);
        
        toast.success(
            <div>
                <p className="font-semibold">Moved to cart!</p>
                <p className="text-sm">{item.title}</p>
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
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
                
                @keyframes slideInLeft {
                    from {
                        transform: translateX(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes scaleIn {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeInUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .animate-slideInRight {
                    animation: slideInRight 0.3s ease-out;
                }
                
                .animate-slideInLeft {
                    animation: slideInLeft 0.3s ease-out;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.5s ease-out;
                }
            `}</style>

            <div className="max-w-[95%] md:max-w-[90%] mx-auto px-2 md:px-4">
                {/* Header */}
                <div 
                    className="mb-8 md:mb-12 animate-fadeInUp"
                >
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group text-sm md:text-base"
                        >
                            <BsArrowLeft className="text-lg md:text-xl group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Back</span>
                        </button>
                        
                        {wishlistItems.length > 0 && (
                            <button
                                onClick={clearWishlist}
                                className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1 md:gap-2 group"
                            >
                                <BsTrash className="text-xs md:text-sm group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline">Clear All</span>
                                <span className="sm:hidden">Clear</span>
                            </button>
                        )}
                    </div>

                    <div className="text-center mb-3 md:mb-4">
                       
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 md:mb-2 animate-slideInLeft">
                            My Wishlist
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base animate-slideInLeft">
                            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
                        </p>
                    </div>
                </div>

                {/* Wishlist Items Grid */}
                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {wishlistItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="relative overflow-hidden group cursor-pointer bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 animate-scaleIn"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => handleProductClick(item.id)}
                            >
                                {/* Image Container */}
                                <div className="relative overflow-hidden">
                                    <img
                                        className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                                        src={item.image}
                                        alt={item.title}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                                        }}
                                    />
                                    
                                    {/* Discount Badge */}
                                    {item.discount && (
                                        <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-gradient-to-r from-red-600 to-pink-600 text-white px-2 py-1 text-xs md:text-sm font-bold z-10">
                                            {item.discount}
                                        </div>
                                    )}

                                    {/* Out of Stock Badge */}
                                    {!item.inStock && (
                                        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-gray-800 text-white px-2 py-1 text-xs font-semibold z-10">
                                            Out of Stock
                                        </div>
                                    )}

                                    {/* Action Buttons - Always visible on mobile */}
                                    <div className="lg:hidden absolute top-2 right-2 md:top-3 md:right-3 flex flex-col gap-1 md:gap-2 z-10">
                                        <button
                                            onClick={(e) => handleRemoveItem(item.id, e)}
                                            className="bg-white p-1.5 md:p-2 shadow-lg hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:scale-110"
                                        >
                                            <BsTrash className="text-sm md:text-base text-gray-700" />
                                        </button>
                                        <button
                                            onClick={(e) => handleMoveToCart(item, e)}
                                            className="bg-white p-1.5 md:p-2 shadow-lg hover:bg-green-50 hover:text-green-600 transition-all duration-300 hover:scale-110"
                                            disabled={!item.inStock}
                                        >
                                            <BsBag className="text-sm md:text-base text-gray-700" />
                                        </button>
                                    </div>

                                    {/* Desktop Action Buttons - Show on hover */}
                                    <div className={`hidden lg:flex absolute top-3 right-3 flex-col gap-2 transition-all duration-300 z-10 ${
                                        hoveredCard === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                    }`}>
                                        <button
                                            onClick={(e) => handleRemoveItem(item.id, e)}
                                            className="bg-white p-2 shadow-lg hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:scale-110"
                                            title="Remove from wishlist"
                                        >
                                            <BsTrash className="text-gray-700" />
                                        </button>
                                      
                                    </div>

                                    {/* Move to Cart Button - Desktop only (show on hover) */}
                                    <button
                                        className={`hidden lg:block absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-600 py-2 px-6 transition-all duration-300 w-[90%] hover:scale-105 uppercase tracking-wide text-sm z-10 font-semibold shadow-md ${
                                            !item.inStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                                        } ${
                                            hoveredCard === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (item.inStock) handleMoveToCart(item, e);
                                        }}
                                        disabled={!item.inStock}
                                    >
                                        {item.inStock ? 'Move to Cart' : 'Out of Stock'}
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-3 md:p-4 border-t border-gray-100">
                                    <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 line-clamp-2 text-sm md:text-base group-hover:text-gray-900 transition-colors">
                                        {item.title}
                                    </h3>
                                    
                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-1 md:mb-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-3 h-3 md:w-4 md:h-4 ${
                                                        i < Math.floor(item.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                                                    }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-xs md:text-sm text-gray-500">{item.rating || 'N/A'}</span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center gap-1 md:gap-2">
                                        <span className="text-base md:text-lg font-bold text-gray-900 flex items-center">
                                            <BsCurrencyRupee className="text-xs md:text-sm" />
                                            {item.price}
                                        </span>
                                        {item.originalPrice && item.originalPrice > item.price && (
                                            <span className="text-xs md:text-sm text-gray-500 line-through flex items-center">
                                                <BsCurrencyRupee className="text-xs" />
                                                {item.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        className="text-center py-6 md:py-8 animate-scaleIn"
                    >
                        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center animate-fadeInUp">
                            <BsHeart className="text-4xl md:text-5xl text-red-500" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-2 md:mb-3 animate-slideInLeft">
                            Your wishlist is empty
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base mb-6 md:mb-8 max-w-md mx-auto px-4 animate-slideInLeft">
                            Save items you love to your wishlist. Review them anytime and easily move them to the cart.
                        </p>
                        <button
                            onClick={() => navigate('/categories')}
                            className="px-6 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold text-sm md:text-base hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fadeInUp"
                        >
                            Start Shopping
                        </button>
                    </div>
                )}

                {/* CTA Section for empty wishlist */}
                {wishlistItems.length > 0 && (
                    <div
                        className="mt-8 md:mt-12 text-center animate-fadeInUp"
                    >
                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 md:p-8 border border-gray-200">
                            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">
                                Ready to make them yours?
                            </h3>
                            <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6 max-w-lg mx-auto px-2 md:px-0">
                                Move items to your cart to complete your purchase. Your saved items will be waiting for you here.
                            </p>
                            <button
                                onClick={() => navigate('/cart')}
                                className="px-6 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold text-sm md:text-base hover:shadow-lg transition-all duration-300 hover:scale-105 inline-flex items-center gap-1 md:gap-2"
                            >
                                <BsBag className="text-base md:text-lg" />
                                View Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;