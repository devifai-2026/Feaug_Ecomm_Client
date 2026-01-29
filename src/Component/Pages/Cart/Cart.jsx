import React, { useState } from 'react';
import {
    BsCurrencyRupee,
    BsTrash,
    BsArrowLeft,
    BsPlus,
    BsDash,
    BsBagCheck,
    BsTruck,
    BsShieldCheck,
    BsArrowRepeat
} from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useCart } from '../../Context/CartContext';
import Banner from '../../Common/Banner';


const Cart = () => {
    const navigate = useNavigate();
    const [promoCode, setPromoCode] = useState('');
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);


    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,

    } = useCart();


    const handleRemoveItem = (item, e) => {
        e.stopPropagation();
        removeFromCart(item.id);

        toast.success(
            <div>
                <p className="font-semibold">Removed from cart!</p>
                <p className="text-sm">{item.title}</p>
            </div>,
            {
                icon: '🗑️',
                duration: 3000,
                style: {
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                },
            }
        );
    };

    const handleApplyPromo = () => {
        if (!promoCode.trim()) {
            toast.error('Please enter a promo code!');
            return;
        }

        setIsApplyingPromo(true);

        // Simulate API call
        setTimeout(() => {
            setIsApplyingPromo(false);
            if (promoCode.toUpperCase() === 'SAVE10') {
                toast.success('Promo code applied! 10% discount added.');
            } else {
                toast.error('Invalid promo code!');
            }
            setPromoCode('');
        }, 1000);
    };

    const handleProceedToCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty!');
            return;
        }

        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            toast.error('Please login to proceed to checkout', {
                icon: '🔒',
                duration: 3000,
            });
            // Navigate to login page after a short delay
            setTimeout(() => navigate('/login'), 1000);
            return;
        }

        toast.success('Proceeding to checkout!', {
            icon: '🛒',
            duration: 2000,
        });

        // Navigate to checkout page
        setTimeout(() => navigate('/checkout'), 1000);
    };

    const handleContinueShopping = () => {
        navigate('/categories');
    };

    const handleQuantityChange = (itemId, value) => {
        const quantity = parseInt(value) || 1;
        if (quantity >= 1 && quantity <= 10) {
            updateQuantity(itemId, quantity);
        }
    };

    const calculateItemTotal = (item) => {
        const price = item.price || 0;
        return price * item.quantity;
    };



    // Debug log to check cart items
    console.log('Cart Items in Cart Page:', cartItems);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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

            <style>{`
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
                
                .animate-slideInLeft {
                    animation: slideInLeft 0.3s ease-out;
                }
                
                .animate-slideInRight {
                    animation: slideInRight 0.3s ease-out;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.5s ease-out;
                }
            `}</style>

            {/* Top Banner for Cart Page */}
            <Banner
                page="cart"
                position="top"
                className="h-32 md:h-40"
            />

            <div className="max-w-[90%] mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-12 animate-fadeInUp">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                        >
                            <BsArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Continue Shopping</span>
                        </button>

                        {cartItems.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2 group"
                            >
                                <BsTrash className="text-sm group-hover:scale-110 transition-transform" />
                                Clear Cart
                            </button>
                        )}
                    </div>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-50 to-amber-100 mb-4 animate-scaleIn">
                            <BsBagCheck className="text-3xl text-amber-600" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 animate-slideInLeft">
                            Shopping Cart
                        </h1>
                        <p className="text-gray-600 animate-slideInLeft">
                            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>
                </div>

                {cartItems && cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Cart Items List */}
                            {cartItems.map((item, index) => (
                                <div
                                    key={`${item.id}-${index}`}
                                    className="bg-white shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg animate-scaleIn"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="p-6 flex flex-col sm:flex-row gap-6">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0 w-full sm:w-40 h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={item.image || '/placeholder-image.jpg'}
                                                alt={item.title || 'Product'}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                        {item.title || 'Unnamed Product'}
                                                    </h3>
                                                    {item.description && (
                                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => handleRemoveItem(item, e)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50"
                                                    title="Remove item"
                                                >
                                                    <BsTrash className="text-lg" />
                                                </button>
                                            </div>

                                            {/* Price and Quantity */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                                                {/* Price */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-bold text-gray-900 flex items-center">
                                                        <BsCurrencyRupee className="text-sm" />
                                                        {calculateItemTotal(item).toFixed(2)}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        ({item.quantity} × <BsCurrencyRupee className="inline" />
                                                        {item.price || 0})
                                                    </span>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => decreaseQuantity(item.id)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <BsDash className="text-gray-600" />
                                                    </button>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="10"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                        className="w-16 h-8 border border-gray-300 text-center text-gray-800 font-medium"
                                                    />

                                                    <button
                                                        onClick={() => increaseQuantity(item.id)}
                                                        disabled={item.quantity >= 10}
                                                        className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <BsPlus className="text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6 animate-slideInRight">
                                {/* Order Summary Card */}
                                <div className="bg-white shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
                                        Order Summary
                                    </h2>

                                    {/* Price Breakdown */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium flex items-center">
                                                <BsCurrencyRupee className="text-sm mr-1" />
                                                {getSubtotal().toFixed(2)}
                                            </span>
                                        </div>


                                    </div>

                                    {/* Promo Code */}
                                    <div className="mb-6">
                                        <h3 className="font-medium text-gray-700 mb-2">Promo Code</h3>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                placeholder="Enter promo code"
                                                className="flex-1 px-4 py-2 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                                            />
                                            <button
                                                onClick={handleApplyPromo}
                                                disabled={isApplyingPromo}
                                                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isApplyingPromo ? 'Applying...' : 'Apply'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="border-t border-gray-200 pt-4 space-y-2">
                                        <div className="flex justify-between text-lg">
                                            <span className="font-bold text-gray-800">Total</span>
                                            <span className="font-bold text-gray-800 flex items-center">
                                                <BsCurrencyRupee className="text-sm mr-1" />
                                                {getSubtotal().toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Including all taxes and shipping
                                        </p>
                                    </div>

                                    {/* Checkout Button */}
                                    <Link to='/checkout'>
                                        <button
                                            onClick={handleProceedToCheckout}
                                            className="w-full mt-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </Link>
                                </div>

                                {/* Trust Badges */}
                                <div className="bg-white shadow-sm border border-gray-200 p-6">
                                    <h3 className="font-bold text-gray-800 mb-4">Secure Shopping</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <div className="w-12 h-12 mx-auto mb-2 bg-blue-50 flex items-center justify-center">
                                                <BsTruck className="text-2xl text-blue-600" />
                                            </div>
                                            <p className="text-xs text-gray-600">Free Shipping Over ₹999</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 mx-auto mb-2 bg-green-50 flex items-center justify-center">
                                                <BsShieldCheck className="text-2xl text-green-600" />
                                            </div>
                                            <p className="text-xs text-gray-600">Secure Payment</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 mx-auto mb-2 bg-purple-50 flex items-center justify-center">
                                                <BsArrowRepeat className="text-2xl text-purple-600" />
                                            </div>
                                            <p className="text-xs text-gray-600">10-Day Returns</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 animate-scaleIn">
                        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center animate-fadeInUp">
                            <BsBagCheck className="text-5xl text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-3 animate-slideInLeft">
                            Your cart is empty
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto animate-slideInLeft">
                            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
                        </p>
                        <button
                            onClick={handleContinueShopping}
                            className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fadeInUp"
                        >
                            Start Shopping
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Banner for Cart Page */}
            <Banner
                page="cart"
                position="bottom"
                className="h-40 md:h-52 mt-12"
            />
        </div>
    );
};

export default Cart;