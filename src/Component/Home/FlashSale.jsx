import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import banner from "../../assets/cleopatra/freepik__design-editorial-soft-studio-light-photography-hig__70850.png"
import productApi from '../../apis/productApi';
import { useCart } from '../Context/CartContext';

const FlashSale = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [saleProduct, setSaleProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        mins: 0,
        secs: 0
    });

    // Set end date for flash sale (7 days from now by default)
    const [saleEndDate] = useState(() => {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(23, 59, 59, 999);
        return endDate;
    });

    // Fetch on-sale products
    useEffect(() => {
        productApi.getOnSaleProducts({
            params: { limit: 1 },
            setLoading,
            onSuccess: (data) => {
                if (data.success && data.data?.products?.length > 0) {
                    const product = data.data.products[0];
                    setSaleProduct({
                        id: product._id || product.id,
                        name: product.name,
                        description: product.shortDescription || product.description,
                        image: product.images?.[0]?.url || banner,
                        price: product.sellingPrice || product.basePrice,
                        originalPrice: product.basePrice,
                        discountPercentage: product.discountValue ||
                            (product.basePrice && product.sellingPrice
                                ? Math.round(((product.basePrice - product.sellingPrice) / product.basePrice) * 100)
                                : 0),
                        stock: product.stock || 0
                    });
                } else {
                    // Fallback to featured product if no sale products
                    productApi.getFeaturedProducts({
                        params: { limit: 1 },
                        onSuccess: (featuredData) => {
                            if (featuredData.success && featuredData.data?.products?.length > 0) {
                                const product = featuredData.data.products[0];
                                setSaleProduct({
                                    id: product._id || product.id,
                                    name: product.name,
                                    description: product.shortDescription || product.description,
                                    image: product.images?.[0]?.url || banner,
                                    price: product.sellingPrice || product.basePrice,
                                    originalPrice: product.basePrice,
                                    discountPercentage: 0,
                                    stock: product.stock || 0
                                });
                            }
                        },
                        onError: () => { }
                    });
                }
            },
            onError: (err) => {
                console.error('Error fetching sale products:', err);
            },
        });
    }, []);

    // Countdown timer
    const calculateTimeLeft = useCallback(() => {
        const now = new Date();
        const difference = saleEndDate - now;

        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                mins: Math.floor((difference / 1000 / 60) % 60),
                secs: Math.floor((difference / 1000) % 60)
            };
        }

        return { days: 0, hours: 0, mins: 0, secs: 0 };
    }, [saleEndDate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    const handleAddToCart = () => {
        if (!saleProduct) return;

        if (saleProduct.stock <= 0) {
            toast.error('This product is currently out of stock');
            return;
        }

        addToCart({
            id: saleProduct.id,
            title: saleProduct.name,
            price: saleProduct.price,
            originalPrice: saleProduct.originalPrice,
            image: saleProduct.image,
            description: saleProduct.description,
        }, 1);

        toast.success('Added to cart!');
    };

    const handleViewProduct = () => {
        if (saleProduct) {
            navigate(`/product/${saleProduct.id}`);
        }
    };

    const formatNumber = (num) => {
        return num.toString().padStart(2, '0');
    };

    const backgroundImage = saleProduct?.image || banner;

    return (
        <div
            className="min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] bg-cover bg-center bg-no-repeat relative max-w-[90%] mx-auto mt-8 overflow-hidden"
            style={{
                backgroundImage: `url(${backgroundImage})`
            }}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${backgroundImage})`
                }}
            ></div>

            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Content positioned: lg right side y-center, sm center x and y */}
            <div
                className="group-content absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-1/2 lg:left-auto lg:right-6 lg:translate-x-0 max-w-sm md:max-w-lg lg:max-w-xl bg-white p-4 sm:p-5 md:p-6"
            >
                <div className='border-2 border-yellow-800 border-opacity-35 p-4 sm:p-5 md:p-6'>
                    {/* Flash Sale Badge */}
                    <p
                        className="text-xs sm:text-sm font-semibold tracking-wider text-center text-yellow-800 text-opacity-35 mb-3 sm:mb-4"
                    >
                        FLASH SALE
                        {saleProduct?.discountPercentage > 0 && (
                            <span className="ml-2 text-red-500">
                                {saleProduct.discountPercentage}% OFF
                            </span>
                        )}
                    </p>

                    {/* Product Title */}
                    {loading ? (
                        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-3 sm:mb-4 animate-pulse"></div>
                    ) : (
                        <h1
                            className="text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-3 sm:mb-4 text-center cursor-pointer hover:text-yellow-800 transition-colors"
                            onClick={handleViewProduct}
                        >
                            {saleProduct?.name || 'Featured Product'}
                        </h1>
                    )}

                    {/* Product Description */}
                    {loading ? (
                        <div className="space-y-2 mb-4 sm:mb-6">
                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto animate-pulse"></div>
                        </div>
                    ) : (
                        <p
                            className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 text-center line-clamp-3"
                        >
                            {saleProduct?.description || 'Discover our exclusive collection of premium jewelry.'}
                        </p>
                    )}

                    {/* Price Display */}
                    {saleProduct && (
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <span className="text-xl sm:text-2xl font-bold text-yellow-800">
                                ₹{saleProduct.price?.toLocaleString('en-IN')}
                            </span>
                            {saleProduct.originalPrice > saleProduct.price && (
                                <span className="text-sm text-gray-400 line-through">
                                    ₹{saleProduct.originalPrice?.toLocaleString('en-IN')}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Timer */}
                    <div
                        className="flex items-center justify-center space-x-1 sm:space-x-2 mb-3 sm:mb-4"
                    >
                        <div className="text-center">
                            <div className="bg-white text-black rounded">
                                <span className="text-lg sm:text-xl md:text-2xl font-bold">{formatNumber(timeLeft.days)} :</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white text-black rounded">
                                <span className="text-lg sm:text-xl md:text-2xl font-bold">{formatNumber(timeLeft.hours)} :</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white text-black rounded">
                                <span className="text-lg sm:text-xl md:text-2xl font-bold">{formatNumber(timeLeft.mins)} :</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white text-black rounded">
                                <span className="text-lg sm:text-xl md:text-2xl font-bold">{formatNumber(timeLeft.secs)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timer Labels */}
                    <div
                        className="flex items-center justify-center space-x-3 sm:space-x-4 md:space-x-5 mb-4 sm:mb-6"
                    >
                        <span className="text-xs text-gray-500">DAYS</span>
                        <span className="text-xs text-gray-500">HOURS</span>
                        <span className="text-xs text-gray-500">MINS</span>
                        <span className="text-xs text-gray-500">SECS</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={handleAddToCart}
                            disabled={loading || !saleProduct || saleProduct.stock <= 0}
                            className='flex items-center justify-center bg-yellow-800 bg-opacity-35 px-4 py-2 cursor-pointer hover:bg-opacity-60 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <span className="text-white font-semibold text-xs sm:text-sm md:text-base">
                                {saleProduct?.stock <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                            </span>
                        </button>
                        {saleProduct && (
                            <button
                                onClick={handleViewProduct}
                                className='flex items-center justify-center border border-yellow-800 border-opacity-35 px-4 py-2 cursor-pointer hover:bg-yellow-800 hover:bg-opacity-10 transition-all'
                            >
                                <span className="text-yellow-800 font-semibold text-xs sm:text-sm md:text-base">
                                    VIEW
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashSale;
