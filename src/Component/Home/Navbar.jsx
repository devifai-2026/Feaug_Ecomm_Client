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

const Navbar = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartCount] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    
    // Carousel state
    const [currentSlide, setCurrentSlide] = useState(0);

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
        }, 5000); // Change slide every 5 seconds

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
        if (!isHomePage) return 'bg-white'; // Always white on non-home pages
        if (isScrolled) return 'bg-white shadow-md'; // White with shadow when scrolled
        return 'bg-transparent'; // Transparent when at top on home page
    };

    // Determine text color based on background
    const getTextColor = () => {
        if (!isHomePage) return 'text-gray-800'; // Dark text on white background
        if (isScrolled) return 'text-gray-800'; // Dark text when scrolled
        return 'text-white'; // White text when transparent
    };

    return (
        <div className="relative">
            {/* Fixed Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 lg:px-8 transition-all duration-300 ${getNavbarBackground()}`}>
                <div className="max-w-[90%] mx-auto flex justify-between items-center">
                    {/* Left Section - Logo - Hidden on lg devices */}
                    <div 
                        data-aos="zoom-in" 
                        data-aos-delay="100"
                        className="lg:hidden"
                    >
                        <Link to="/">
                            <h2 className={`uppercase text-2xl md:3xl lg:text-3xl font-bold font-playfair ${getTextColor()}`}>
                                Feauag
                            </h2>
                        </Link>
                    </div>

                    {/* Center Section - Navigation Links (Desktop) */}
                    <div className={`hidden lg:flex items-center gap-6 ${getTextColor()}`}>
                        <div 
                            className='flex items-center gap-1 cursor-pointer group relative'
                            data-aos="fade-down"
                            data-aos-delay="200"
                        >
                            <p>Categories</p>
                            <LuChevronDown className="text-sm transition-transform duration-200 group-hover:rotate-180" />
                        </div>
                        <div 
                            className='flex items-center gap-1 cursor-pointer group relative'
                            data-aos="fade-down"
                            data-aos-delay="300"
                        >
                            <p>About</p>
                            <LuChevronDown className="text-sm transition-transform duration-200 group-hover:rotate-180" />
                        </div>
                        <p 
                            className='cursor-pointer'
                            data-aos="fade-down"
                            data-aos-delay="400"
                        >
                            Blog
                        </p>
                        <p 
                            className='cursor-pointer'
                            data-aos="fade-down"
                            data-aos-delay="500"
                        >
                            Contact
                        </p>
                    </div>

                    {/* Center Logo - Only visible on lg devices */}
                    <div 
                        className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2"
                        data-aos="zoom-in" 
                        data-aos-delay="100"
                    >
                        <Link to="/">
                            <h2 className={`uppercase text-3xl font-bold font-playfair ${getTextColor()}`}>
                                Feauag
                            </h2>
                        </Link>
                    </div>

                    {/* Right Section - User Actions */}
                    <div className={`flex items-center gap-4 ${getTextColor()}`}>
                        {/* Desktop User Actions */}
                        <div className='hidden lg:flex items-center gap-4'>
                            <div 
                                className='flex items-center gap-1 cursor-pointer group relative border-r-2 pr-3'
                                data-aos="fade-down"
                                data-aos-delay="200"
                            >
                                <p>INR</p>
                                <LuChevronDown className="text-sm transition-transform duration-200 group-hover:rotate-180" />
                            </div>
                            
                            <div 
                                className='flex items-center gap-1 cursor-pointer group relative border-r-2 pr-3'
                                data-aos="fade-down"
                                data-aos-delay="300"
                            >
                                <p>EN</p>
                                <LuChevronDown className="text-sm transition-transform duration-200 group-hover:rotate-180" />
                            </div>
                            
                            <div className='flex items-center gap-3'>
                                <LuUserRound 
                                    className="text-xl cursor-pointer hover:text-gray-300 transition-colors"
                                    data-aos="fade-left"
                                    data-aos-delay="400"
                                />
                                <HiOutlineMagnifyingGlass 
                                    className="text-xl cursor-pointer hover:text-gray-300 transition-colors"
                                    data-aos="fade-left"
                                    data-aos-delay="500"
                                />
                                {/* Shopping Bag with Count Badge - Always Visible */}
                                <div className="relative">
                                    <BsHandbag 
                                        className="text-xl cursor-pointer hover:text-gray-300 transition-colors"
                                        data-aos="fade-left"
                                        data-aos-delay="600"
                                    />
                                    <span className="absolute -bottom-2 -right-2 bg-amber-700 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Mobile User Actions - Only Hamburger + Shopping Bag */}
                        <div className="flex lg:hidden items-center gap-3">
                            {/* Shopping Bag with Count Badge - Always Visible */}
                            <div className="relative">
                                <BsHandbag
                                    className="text-xl cursor-pointer hover:text-gray-300 transition-colors"
                                    data-aos="fade-left"
                                    data-aos-delay="600"
                                />
                                <span className="absolute -bottom-2 -right-2 bg-amber-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                    {cartCount}
                                </span>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className={`text-2xl ${getTextColor()}`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                data-aos="fade-left"
                                data-aos-delay="700"
                            >
                                {isMobileMenuOpen ? <LuX /> : <LuMenu />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - Drawer Style */}
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop Overlay */}
                        <div
                            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setIsMobileMenuOpen(false)}
                        ></div>

                        {/* Drawer Menu */}
                        <div
                            className="lg:hidden fixed top-0 right-0 h-full w-60 md:w-80 bg-white text-gray-800 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out"
                            data-aos="slide-left"
                            data-aos-duration="300"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-xl font-semibold">Menu</h3>
                                <button
                                    className="text-2xl text-gray-600 hover:text-gray-800 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <LuX />
                                </button>
                            </div>

                            {/* Drawer Content */}
                            <div className="h-full overflow-y-auto p-6">
                                <div className="flex flex-col space-y-6">
                                    {/* User Profile and Search at Top */}
                                    <div className="space-y-4 pb-4 border-b border-gray-200">
                                        <div className="flex items-center gap-3 cursor-pointer py-3 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                                            <LuUserRound className="text-lg text-gray-600" />
                                            <span className="font-medium">My Profile</span>
                                        </div>
                                        <div className="flex items-center gap-3 cursor-pointer py-3 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                                            <HiOutlineMagnifyingGlass className="text-lg text-gray-600" />
                                            <span className="font-medium">Search</span>
                                        </div>
                                    </div>

                                    {/* Currency and Language Settings */}
                                    <div className="space-y-4 pb-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between cursor-pointer py-3 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                                            <span className="font-medium">INR</span>
                                            <LuChevronDown className="text-gray-500" />
                                        </div>
                                        <div className="flex items-center justify-between cursor-pointer py-3 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                                            <span className="font-medium">EN</span>
                                            <LuChevronDown className="text-gray-500" />
                                        </div>
                                    </div>

                                    {/* Navigation Links */}
                                    <div className="space-y-2 pb-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between cursor-pointer py-3 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                                            <span className="font-medium">Categories</span>
                                            <LuChevronDown className="text-gray-500" />
                                        </div>
                                        <div className="flex items-center justify-between cursor-pointer py-3 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                                            <span className="font-medium">About</span>
                                            <LuChevronDown className="text-gray-500" />
                                        </div>
                                        <div className="cursor-pointer py-3 hover:bg-gray-50 px-3 rounded-lg transition-colors font-medium">
                                            Blog
                                        </div>
                                        <div className="cursor-pointer py-3 hover:bg-gray-50 px-3 rounded-lg transition-colors font-medium">
                                            Contact
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </nav>

            {/* Hero Section with Auto Carousel - Only on Home Page */}
            {isHomePage && (
                <div className="relative min-h-[90vh] mt-0">
                    {/* Carousel Slides */}
                    {carouselSlides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{ backgroundImage: `url(${slide.background})` }}
                        >
                            {/* Overlay for better text readability */}
                            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                            
                            {/* Carousel Content */}
                            <div className={`relative z-10 flex flex-col items-center justify-center text-center text-white min-h-[90vh] px-4 max-w-[90%] mx-auto transition-transform duration-1000 ${
                                index === currentSlide ? 'translate-y-0' : 'translate-y-10'
                            }`}>
                                <h1
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-bold mb-4 drop-shadow-lg text-center uppercase"
                                    data-aos="slide-down"
                                    data-aos-delay="200"
                                    data-aos-duration="800"
                                >
                                    {slide.title}
                                </h1>
                                <h1
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-bold mb-4 drop-shadow-lg text-center uppercase"
                                    data-aos="slide-up"
                                    data-aos-delay="400"
                                    data-aos-duration="800"
                                >
                                    {slide.subtitle}
                                </h1>
                                <p
                                    className="text-lg sm:text-xl md:text-2xl mb-8 drop-shadow-md max-w-2xl"
                                    data-aos="fade-in"
                                    data-aos-delay="600"
                                    data-aos-duration="1000"
                                >
                                    {slide.description}
                                </p>
                                <button
                                    className="bg-transparent text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 transition duration-300 transform hover:scale-110 text-sm sm:text-base border-t-2 border-b-2 border-r border-l"
                                    data-aos="bounce-in"
                                    data-aos-delay="800"
                                    data-aos-duration="600"
                                >
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Carousel Navigation Dots */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
                        {carouselSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentSlide 
                                        ? 'bg-white scale-125' 
                                        : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
                    >
                        <MdKeyboardArrowLeft />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
                    >
                       <MdKeyboardArrowRight />
                    </button>
                </div>
            )}

            {/* Spacer for fixed navbar on non-home pages */}
            {!isHomePage && <div className="h-20"></div>}
        </div>
    );
};

export default Navbar;