import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import flashSaleApi from '../../apis/flashSaleApi';
import { useCart } from '../Context/CartContext';

const FlashSale = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

    useEffect(() => {
        flashSaleApi.getActiveFlashSale({
            setLoading,
            onSuccess: (response) => {
                const data = response.data?.flashSale || response.data;
                if (data && data._id) {
                    setSale(data);
                }
            },
            onError: () => {},
        });
    }, []);

    // Countdown timer
    const calculateTimeLeft = useCallback(() => {
        if (!sale?.endDate) return { days: 0, hours: 0, mins: 0, secs: 0 };
        const difference = new Date(sale.endDate) - new Date();
        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                mins: Math.floor((difference / 1000 / 60) % 60),
                secs: Math.floor((difference / 1000) % 60),
            };
        }
        return { days: 0, hours: 0, mins: 0, secs: 0 };
    }, [sale]);

    useEffect(() => {
        if (!sale) return;
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [sale, calculateTimeLeft]);

    const handleAddToCart = () => {
        if (!sale) return;
        if (sale.stock <= 0) {
            toast.error('This product is currently out of stock');
            return;
        }
        addToCart({
            id: sale._id,
            title: sale.productName,
            price: sale.price,
            originalPrice: sale.originalPrice,
            image: sale.backgroundImage,
            description: sale.description,
        }, 1);
        toast.success('Added to cart!');
    };

    const handleViewProduct = () => {
        console.log({sale});
        navigate('/categories');
        
        // if (sale?.productLink) {
        //     navigate(sale.productLink);
        // }
    };

    const handleCopyPromoCode = () => {
        if (!sale?.promoCode) return;
        navigator.clipboard.writeText(sale.promoCode).then(() => {
            toast.success(`Code "${sale.promoCode}" copied!`);
        }).catch(() => {
            toast(`Use code: ${sale.promoCode}`, { icon: "\u2139\uFE0F" });
        });
    };

    const formatNumber = (num) => num.toString().padStart(2, '0');

    // Don't render anything if no flash sale in DB or still loading
    if (loading || !sale) return null;

    return (
        <div
            className="min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] bg-cover bg-center bg-no-repeat relative max-w-[90%] mx-auto mt-8 overflow-hidden"
            style={{ backgroundImage: `url(${sale.backgroundImage})` }}
        >
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${sale.backgroundImage})` }}
            ></div>

            <div className="absolute inset-0 bg-black/10"></div>

            <div className="group-content absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-1/2 lg:left-auto lg:right-6 lg:translate-x-0 max-w-sm md:max-w-lg lg:max-w-xl bg-white p-4 sm:p-5 md:p-6">
                <div className='border-2 border-yellow-800 border-opacity-35 p-4 sm:p-5 md:p-6'>
                    {/* Sale Title (admin-controlled: "FLASH SALE", "BLACK FRIDAY SALE", etc.) */}
                    <p className="text-xs sm:text-sm font-semibold tracking-wider text-center text-yellow-800 text-opacity-35 mb-3 sm:mb-4">
                        {sale.title}
                        {sale.discountPercentage > 0 && (
                            <span className="ml-2 text-red-500">
                                {sale.discountPercentage}% OFF
                            </span>
                        )}
                    </p>

                    {/* Product Name */}
                    <h1
                        className="text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-3 sm:mb-4 text-center cursor-pointer hover:text-yellow-800 transition-colors"
                        onClick={handleViewProduct}
                    >
                        {sale.productName}
                    </h1>

                    {/* Description */}
                    {sale.description && (
                        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 text-center line-clamp-3">
                            {sale.description}
                        </p>
                    )}

                    {/* Promo Code */}
                    {sale.promoCode && (
                        <button
                            onClick={handleCopyPromoCode}
                            className="flex items-center justify-center gap-2 mx-auto mb-4 px-4 py-1.5 bg-yellow-50 border border-yellow-300 border-dashed rounded text-xs font-semibold text-yellow-800 hover:bg-yellow-100 transition-colors cursor-pointer group"
                            title="Click to copy"
                        >
                            <span>Use code: <span className="tracking-widest">{sale.promoCode}</span></span>
                            {sale.discountPercentage > 0 && (
                                <span className="text-red-500 font-bold">({sale.discountPercentage}% off)</span>
                            )}
                        </button>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-xl sm:text-2xl font-bold text-yellow-800">
                            ₹{sale.price?.toLocaleString('en-IN')}
                        </span>
                        {sale.originalPrice > sale.price && (
                            <span className="text-sm text-gray-400 line-through">
                                ₹{sale.originalPrice?.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>

                    {/* Timer */}
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-3 sm:mb-4">
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
                    <div className="flex items-center justify-center space-x-3 sm:space-x-4 md:space-x-5 mb-4 sm:mb-6">
                        <span className="text-xs text-gray-500">DAYS</span>
                        <span className="text-xs text-gray-500">HOURS</span>
                        <span className="text-xs text-gray-500">MINS</span>
                        <span className="text-xs text-gray-500">SECS</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={handleAddToCart}
                            disabled={sale.stock <= 0}
                            className='flex items-center justify-center bg-yellow-800 bg-opacity-35 px-4 py-2 cursor-pointer hover:bg-opacity-60 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <span className="text-white font-semibold text-xs sm:text-sm md:text-base">
                                {sale.stock <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                            </span>
                        </button>
                        {sale.productLink && (
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
