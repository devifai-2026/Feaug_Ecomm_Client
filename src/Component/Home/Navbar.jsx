import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import banner from "../../assets/Banner/one.png";
import banneTwo from "../../assets/Banner/two.png";
import bannerThree from "../../assets/Banner/three.png";
import bannerFour from "../../assets/Banner/four.png";
import { LuUserRound, LuChevronDown, LuMenu, LuX } from "react-icons/lu";
import { BsHandbag } from "react-icons/bs";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa6";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [wishlistCount, setWishlistCount] = useState(0);
    
    // Carousel state
    const [currentSlide, setCurrentSlide] = useState(0);

    // Get cart from context
    const { getTotalUniqueItems } = useCart();

    // Get wishlist count from localStorage
    useEffect(() => {
        const updateWishlistCount = () => {
            try {
                const savedWishlist = localStorage.getItem('wishlist');
                if (savedWishlist) {
                    const wishlistItems = JSON.parse(savedWishlist);
                    setWishlistCount(wishlistItems.length);
                } else {
                    setWishlistCount(0);
                }
            } catch (error) {
                console.error('Error parsing wishlist:', error);
                setWishlistCount(0);
            }
        };

        updateWishlistCount();
        const interval = setInterval(updateWishlistCount, 1000);

        return () => clearInterval(interval);
    }, []);

    // Scroll effect for navbar background
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check if a link is active
    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    // Carousel content
    const carouselSlides = [
        {
            title: "Discover Sparkle",
            subtitle: "With Style",
            description: "Whether casual or formal, find the perfect jewelry for every occasion.",
            background: banner
        },
        {
            title: "Elegant Collection",
            subtitle: "Timeless Beauty",
            description: "Explore our exclusive range of handcrafted jewelry pieces.",
            background: banneTwo
        },
        {
            title: "Luxury Redefined",
            subtitle: "Premium Quality",
            description: "Experience the finest craftsmanship in every piece we create.",
            background: bannerThree
        },
        {
            title: "Special Offers",
            subtitle: "Limited Edition",
            description: "Don't miss out on our exclusive seasonal collections.",
            background: bannerFour
        }
    ];

    // Auto carousel effect
    useEffect(() => {
        if (!isHomePage) return;
        
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isHomePage, carouselSlides.length]);

    // Manual slide navigation
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    };

    // Determine navbar background color
    const getNavbarBackground = () => {
        if (!isHomePage) return 'bg-white'; 
        if (isScrolled) return 'bg-white shadow-md';
        return 'bg-transparent';
    };

    // Determine text color based on background
    const getTextColor = () => {
        if (!isHomePage) return 'text-gray-800';
        if (isScrolled) return 'text-gray-800';
        return 'text-white';
    };

    return (
        <div className="relative">
            {/* Fixed Navbar - FIXED CONTAINER WIDTH */}
            <nav className={`fixed top-0 left-0 right-0 z-50 py-3 md:py-4 transition-all duration-300 ${getNavbarBackground()}`}>
                <div className="w-full px-4 mx-auto flex justify-between items-center">
                    {/* Left Section - Logo */}
                    <div className="lg:hidden">
                        <Link to="/">
                            <h2 className={`uppercase text-2xl font-bold font-playfair ${getTextColor()}`}>
                                Feauag
                            </h2>
                        </Link>
                    </div>

                    {/* Center Section - Navigation Links (Desktop) */}
                    <div className={`hidden lg:flex items-center gap-6 ${getTextColor()}`}>
                        <Link to="/categories">
                            <div className='flex items-center gap-1 cursor-pointer group relative'>
                                <p className={`transition-colors duration-300 ${isActiveLink('/categories') ? 'text-[#C19A6B]' : getTextColor()} hover:text-[#C19A6B]`}>
                                    Categories
                                </p>
                                <LuChevronDown className={`text-sm transition-all duration-200 ${isActiveLink('/categories') ? 'text-[#C19A6B]' : 'group-hover:text-[#C19A6B]'}`} />
                            </div>
                        </Link>
                        <Link to='/about'>
                            <p className={`cursor-pointer transition-colors duration-300 ${isActiveLink('/about') ? 'text-[#C19A6B]' : getTextColor()} hover:text-[#C19A6B]`}>
                                About
                            </p>
                        </Link>
                        <Link to='/blog'>
                            <p className={`cursor-pointer transition-colors duration-300 ${isActiveLink('/blog') ? 'text-[#C19A6B]' : getTextColor()} hover:text-[#C19A6B]`}>
                                Blog
                            </p>
                        </Link>
                        <Link to='/contact'>
                            <p className={`cursor-pointer transition-colors duration-300 ${isActiveLink('/contact') ? 'text-[#C19A6B]' : getTextColor()} hover:text-[#C19A6B]`}>
                                Contact
                            </p>
                        </Link>
                    </div>

                    {/* Center Logo - Only visible on lg devices */}
                    <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
                        <Link to="/">
                            <h2 className={`uppercase text-3xl font-bold font-playfair ${getTextColor()}`}>
                                Feauag
                            </h2>
                        </Link>
                    </div>

                    {/* Right Section - User Actions */}
                    <div className={`flex items-center gap-2 ${getTextColor()}`}>
                        {/* Desktop User Actions */}
                        <div className='hidden lg:flex items-center gap-4'>
                            <div className='flex items-center gap-1 cursor-pointer group relative border-r-2 pr-3'>
                                <p className="transition-colors duration-300 hover:text-[#C19A6B]">INR</p>
                            </div>
                            
                            <div className='flex items-center gap-1 cursor-pointer group relative border-r-2 pr-3'>
                                <p className="transition-colors duration-300 hover:text-[#C19A6B]">EN</p>
                            </div>
                            
                            <div className='flex items-center gap-3'>
                              <Link to='/login'>
  <LuUserRound 
    className="text-xl cursor-pointer hover:text-[#C19A6B] transition-colors duration-300"
  />
</Link>
                                <HiOutlineMagnifyingGlass 
                                    className="text-xl cursor-pointer hover:text-[#C19A6B] transition-colors duration-300"
                                />
                                <div className="flex items-center gap-5">
                                    {/* Wishlist */}
                                    <Link to='/wishlist'>
                                        <div className="relative">
                                            <FaRegHeart 
                                                className="text-xl cursor-pointer hover:text-[#C19A6B] transition-colors duration-300"
                                            />
                                            <span className="absolute -bottom-2 -right-2 bg-amber-700 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                                {wishlistCount}
                                            </span>
                                        </div>
                                    </Link>
                                    {/* Shopping Bag */}
                                    <Link to='/cart'>
                                        <div className="relative">
                                            <BsHandbag 
                                                className="text-xl cursor-pointer hover:text-[#C19A6B] transition-colors duration-300"
                                            />
                                            <span className="absolute -bottom-2 -right-2 bg-amber-700 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                                {getTotalUniqueItems()}
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Mobile User Actions - SIMPLE AND STABLE */}
                        <div className="flex lg:hidden items-center gap-3">
                            {/* Wishlist */}
                            <Link to='/wishlist'>
                                <div className="relative">
                                    <FaRegHeart
                                        className="text-lg cursor-pointer hover:text-[#C19A6B] transition-colors duration-300"
                                    />
                                    <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                </div>
                            </Link>
                            {/* Shopping Bag */}
                            <Link to='/cart'>
                                <div className="relative">
                                    <BsHandbag
                                        className="text-lg cursor-pointer hover:text-[#C19A6B] transition-colors duration-300"
                                    />
                                    <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                                        {getTotalUniqueItems()}
                                    </span>
                                </div>
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                className={`text-xl transition-colors duration-300 hover:text-[#C19A6B] ${getTextColor()}`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <LuX /> : <LuMenu />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <>
                        <div
                            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setIsMobileMenuOpen(false)}
                        ></div>

                        <div className="lg:hidden fixed top-0 right-0 h-full w-64 bg-white text-gray-800 z-50 shadow-2xl">
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold">Menu</h3>
                                <button
                                    className="text-xl text-gray-600 hover:text-[#C19A6B] transition-colors duration-300"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <LuX />
                                </button>
                            </div>

                            <div className="h-full overflow-y-auto p-4">
                                <div className="flex flex-col space-y-4">
                                    <div className="space-y-3 pb-4 border-b border-gray-200">
                                        <Link to='/login'>
  <LuUserRound 
    className="text-xl cursor-pointer hover:text-[#C19A6B] transition-colors duration-300"
  />
</Link>
                                        <div className="flex items-center gap-3 cursor-pointer py-2 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                                            <HiOutlineMagnifyingGlass className="text-lg text-gray-600" />
                                            <span className="font-medium hover:text-[#C19A6B] transition-colors duration-300">Search</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pb-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between cursor-pointer py-2 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                                            <span className="font-medium hover:text-[#C19A6B] transition-colors duration-300">INR</span>
                                        </div>
                                        <div className="flex items-center justify-between cursor-pointer py-2 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                                            <span className="font-medium hover:text-[#C19A6B] transition-colors duration-300">EN</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pb-4 border-b border-gray-200">
                                        <Link to='/categories' onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className={`flex items-center justify-between cursor-pointer py-2 hover:bg-gray-50 px-3 rounded-lg transition-colors ${isActiveLink('/categories') ? 'bg-gray-50' : ''}`}>
                                                <span className={`font-medium transition-colors duration-300 ${isActiveLink('/categories') ? 'text-[#C19A6B]' : 'text-gray-800 hover:text-[#C19A6B]'}`}>
                                                    Categories
                                                </span>
                                                <LuChevronDown className={`transition-colors duration-300 ${isActiveLink('/categories') ? 'text-[#C19A6B]' : 'text-gray-500'}`} />
                                            </div>
                                        </Link>
                                        <Link to='/about' onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className={`cursor-pointer py-2 hover:bg-gray-50 px-3 rounded-lg transition-colors ${isActiveLink('/about') ? 'bg-gray-50' : ''}`}>
                                                <span className={`font-medium transition-colors duration-300 ${isActiveLink('/about') ? 'text-[#C19A6B]' : 'text-gray-800 hover:text-[#C19A6B]'}`}>
                                                    About
                                                </span>
                                            </div>
                                        </Link>
                                        <Link to='/blog' onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className={`cursor-pointer py-2 hover:bg-gray-50 px-3 rounded-lg transition-colors ${isActiveLink('/blog') ? 'bg-gray-50' : ''}`}>
                                                <span className={`font-medium transition-colors duration-300 ${isActiveLink('/blog') ? 'text-[#C19A6B]' : 'text-gray-800 hover:text-[#C19A6B]'}`}>
                                                    Blog
                                                </span>
                                            </div>
                                        </Link>
                                        <Link to='/contact' onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className={`cursor-pointer py-2 hover:bg-gray-50 px-3 rounded-lg transition-colors ${isActiveLink('/contact') ? 'bg-gray-50' : ''}`}>
                                                <span className={`font-medium transition-colors duration-300 ${isActiveLink('/contact') ? 'text-[#C19A6B]' : 'text-gray-800 hover:text-[#C19A6B]'}`}>
                                                    Contact
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </nav>

            {/* Hero Section with Auto Carousel - Only on Home Page */}
            {isHomePage && (
                <div className="relative min-h-[calc(100vh-4rem)] md:min-h-screen">
                    {/* Carousel Slides */}
                    {carouselSlides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{ backgroundImage: `url(${slide.background})` }}
                        >
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                            
                            {/* Carousel Content */}
                            <div className={`relative z-10 flex flex-col items-center justify-center text-center text-white min-h-[calc(100vh-4rem)] md:min-h-screen px-4 mx-auto ${
                                index === currentSlide ? 'translate-y-0' : 'translate-y-10'
                            }`}>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-2 md:mb-3 drop-shadow-lg uppercase leading-tight">
                                    {slide.title}
                                </h1>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-3 md:mb-4 drop-shadow-lg uppercase leading-tight">
                                    {slide.subtitle}
                                </h1>
                                <p className="text-sm sm:text-base md:text-lg mb-4 md:mb-6 drop-shadow-md max-w-xs sm:max-w-sm md:max-w-xl px-2">
                                    {slide.description}
                                </p>
                                {/* UPDATED SHOP NOW BUTTON - Original styling */}
                                <button className="bg-transparent text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 transition duration-300 transform hover:scale-110 text-sm sm:text-base border-t-2 border-b-2 border-r border-l hover:border-[#C19A6B] ">
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Carousel Navigation Dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                        {carouselSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === currentSlide 
                                        ? 'bg-white scale-125' 
                                        : 'bg-white bg-opacity-50 hover:bg-opacity-75 hover:scale-110'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300 hover:text-[#C19A6B]"
                    >
                        <MdKeyboardArrowLeft className="text-base" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300 hover:text-[#C19A6B]"
                    >
                       <MdKeyboardArrowRight className="text-base" />
                    </button>
                </div>
            )}

            {/* Spacer for fixed navbar on non-home pages */}
            {!isHomePage && <div className="h-16"></div>}
        </div>
    );
};

export default Navbar;