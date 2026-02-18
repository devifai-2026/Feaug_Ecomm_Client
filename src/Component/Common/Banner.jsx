import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bannerApi from '../../apis/bannerApi';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

/**
 * Generic Banner Component
 * Fetches and displays banners with support for multiple images (slider)
 * 
 * @param {string} name - Banner name (if fetching by name)
 * @param {string} page - Page name (if fetching by page)
 * @param {string} position - Banner position (optional filter)
 * @param {string} bannerType - Banner type (optional filter)
 * @param {string} className - Additional CSS classes
 * @param {boolean} autoPlay - Auto-play slider (default: true)
 * @param {number} autoPlayInterval - Auto-play interval in ms (default: 5000)
 */
const Banner = ({
    name,
    page,
    position,
    bannerType,
    className = '',
    autoPlay = true,
    autoPlayInterval = 5000,
    showContent = true,
}) => {
    const navigate = useNavigate();
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchBanner();
    }, [name, page, position, bannerType]);

    // Auto-play slider
    useEffect(() => {
        if (!banner || !banner.images || banner.images.length <= 1 || !autoPlay) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % banner.images.length);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [banner, autoPlay, autoPlayInterval]);

    // Default banner configuration
    const defaultBanner = {
        title: "DISCOVER SPARKLE WITH STYLE",
        subheader: "Whether casual or formal, find the perfect jewelry for every occasion.",
        images: [{ url: new URL('../../assets/Banner/one.png', import.meta.url).href }],
        buttonText: "Shop Now",
        redirectUrl: "/categories",
        buttonColor: "#000000",
        backgroundColor: "transparent",
        textColor: "#ffffff"
    };

    const fetchBanner = async () => {
        setLoading(true);
        setError(null);

        try {
            if (name) {
                // Fetch by name
                await bannerApi.getBannerByName({
                    name,
                    setLoading,
                    onSuccess: (data) => {
                        if (data.status === 'success' && data.data?.banner) {
                            setBanner(data.data.banner);
                        } else {
                            // Use default if not found
                            setBanner(defaultBanner);
                        }
                    },
                    onError: (err) => {
                        console.error('Error fetching banner:', err);
                        // Use default on error
                        setBanner(defaultBanner);
                    },
                });
            } else if (page) {
                // Fetch by page
                await bannerApi.getBannersByPage({
                    page,
                    position,
                    bannerType,
                    setLoading,
                    onSuccess: (data) => {
                        if (data.status === 'success' && data.data?.banners?.length > 0) {
                            setBanner(data.data.banners[0]); // Take first banner
                        } else {
                            // Use default if no banners found AND it's the hero/top position
                            if (page === 'home' && (position === 'hero' || position === 'top')) {
                                setBanner(defaultBanner);
                            } else {
                                setError('No banners available');
                            }
                        }
                    },
                    onError: (err) => {
                        console.error('Error fetching banners:', err);
                        // Use default on error for main locations
                        if (page === 'home' && (position === 'hero' || position === 'top')) {
                            setBanner(defaultBanner);
                        } else {
                            setError('Failed to load banners');
                        }
                    },
                });
            }
        } catch (err) {
            console.error('Banner fetch error:', err);
            // Use default on catch for main locations
            if (page === 'home' && (position === 'hero' || position === 'top')) {
                setBanner(defaultBanner);
            } else {
                setError('Failed to load banner');
            }
            setLoading(false);
        }
    };

    const handleBannerClick = () => {
        if (banner?.redirectUrl) {
            let url = banner.redirectUrl;

            // Add promo code as query parameter if available
            if (banner.promoCode) {
                const separator = url.includes('?') ? '&' : '?';
                url = `${url}${separator}promo=${banner.promoCode}`;
            }

            if (url.startsWith('http')) {
                window.location.href = url;
            } else {
                navigate(url);
            }
        }
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % banner.images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + banner.images.length) % banner.images.length);
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    if (loading) {
        return (
            <div className={`animate-pulse bg-gray-200 ${className}`}>
                <div className="h-64 md:h-96 w-full bg-gray-300"></div>
            </div>
        );
    }

    if (error || !banner) {
        return null; // Don't show anything if banner fails to load
    }

    const currentImage = banner.images?.[currentImageIndex];
    const hasMultipleImages = banner.images && banner.images.length > 1;

    // Derived content from current image or fallback to banner defaults
    const title = currentImage?.title || banner.title;
    const subtitle = currentImage?.subtitle || currentImage?.subheader || banner.subheader;
    const description = currentImage?.description || banner.body;

    return (
        <div
            className={`relative overflow-hidden group ${banner.redirectUrl ? 'cursor-pointer' : ''} ${className}`}
            onClick={handleBannerClick}
            style={{
                backgroundColor: banner.backgroundColor || 'transparent',
                color: banner.textColor || 'inherit',
            }}
        >
            {/* Image */}
            {currentImage && (
                <img
                    src={currentImage.url}
                    alt={currentImage.alt || title || 'Banner'}
                    className="w-full h-full object-cover transition-opacity duration-500"
                />
            )}

            {/* Content Overlay */}
            {showContent && (title || subtitle || description || banner.footer || banner.buttonText) && (
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 md:p-12 bg-black/20">
                    {title && (
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 drop-shadow-lg">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-medium mb-2 md:mb-4 drop-shadow-lg">
                            {subtitle}
                        </h3>
                    )}
                    {description && (
                        <p className="text-base md:text-lg lg:text-xl max-w-2xl mb-4 md:mb-6 drop-shadow-lg">
                            {description}
                        </p>
                    )}
                    {banner.buttonText && (
                        <button
                            className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                            style={{
                                backgroundColor: banner.buttonColor || '#000',
                                color: '#fff',
                            }}
                            onClick={handleBannerClick}
                        >
                            {banner.buttonText}
                        </button>
                    )}
                    {banner.footer && (
                        <p className="text-sm md:text-base mt-4 md:mt-6 drop-shadow-lg">
                            {banner.footer}
                        </p>
                    )}
                </div>
            )}

            {/* Navigation Arrows (only if multiple images) */}
            {hasMultipleImages && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                        aria-label="Previous image"
                    >
                        <BsChevronLeft className="text-xl md:text-2xl" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                        aria-label="Next image"
                    >
                        <BsChevronRight className="text-xl md:text-2xl" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {banner.images.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToImage(index);
                                }}
                                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                                    ? 'bg-white w-6 md:w-8'
                                    : 'bg-white/50 hover:bg-white/75'
                                    }`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Banner;
