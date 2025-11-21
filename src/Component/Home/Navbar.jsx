import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import banner from "../../assets/Banner/freepik__design-editorial-soft-studio-light-photography-hig__84582.png"
import { LuUserRound, LuChevronDown, LuMenu, LuX } from 'react-icons/lu';
import { BsHandbag } from 'react-icons/bs';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

const Navbar = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div 
            className={isHomePage ? 
                `bg-cover bg-center bg-no-repeat min-h-[60vh] md:min-h[70vh] lg:min-h-[90vh]` : 
                ''
            }
            style={isHomePage ? { backgroundImage: `url(${banner})` } : {}}
        >
            {/* Navbar */}
            <nav className={`relative z-30 px-4 py-4 lg:px-8 ${!isHomePage ? 'bg-white' : ''}`}>
                <div className="max-w-[90%] mx-auto flex justify-between items-center">
                    {/* Left Section - Logo */}
                    <div data-aos="zoom-in" data-aos-delay="100">
                        <Link to="/">
                            <h2 className={`uppercase text-2xl md:3xl lg:text-3xl font-bold font-playfair ${isHomePage ? 'text-white' : 'text-gray-800'}`}>
                                Feaug
                            </h2>
                        </Link>
                    </div>

                    {/* Center Section - Navigation Links (Desktop) */}
                    <div className={`hidden lg:flex items-center gap-6 ${isHomePage ? 'text-white' : 'text-gray-800'}`}>
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

                    {/* Right Section - User Actions */}
                    <div className={`flex items-center gap-4 ${isHomePage ? 'text-white' : 'text-gray-800'}`}>
                        {/* Desktop User Actions */}
                        <div className='hidden lg:flex items-center gap-4'>
                            <div 
                                className='flex items-center gap-1 cursor-pointer group relative border-r-2 pr-3'
                                data-aos="fade-down"
                                data-aos-delay="200"
                            >
                                <p>USD</p>
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
                                <BsHandbag 
                                    className="text-xl cursor-pointer hover:text-gray-300 transition-colors"
                                    data-aos="fade-left"
                                    data-aos-delay="600"
                                />
                            </div>
                        </div>

                        {/* Mobile User Actions - Only Hamburger + Shopping Bag */}
                        <div className='flex lg:hidden items-center gap-3'>
                            {/* Shopping Bag remains visible on mobile */}
                            <BsHandbag 
                                className="text-xl cursor-pointer hover:text-gray-300 transition-colors"
                                data-aos="fade-left"
                                data-aos-delay="600"
                            />
                            
                            {/* Mobile Menu Button */}
                            <button 
                                className={`text-2xl ${isHomePage ? 'text-white' : 'text-gray-800'}`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                data-aos="fade-left"
                                data-aos-delay="700"
                            >
                                {isMobileMenuOpen ? <LuX /> : <LuMenu />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - Fixed positioning */}
                {isMobileMenuOpen && (
                    <div 
                        className="lg:hidden absolute top-16 left-4 right-4 bg-black bg-opacity-95 text-white rounded-lg p-4 z-40 shadow-xl"
                        data-aos="fade-down"
                        data-aos-duration="300"
                    >
                        <div className="flex flex-col space-y-4">
                            {/* Navigation Links */}
                            <div className='flex items-center justify-between cursor-pointer py-2'>
                                <span>Categories</span>
                                <LuChevronDown />
                            </div>
                            <div className='flex items-center justify-between cursor-pointer py-2'>
                                <span>About</span>
                                <LuChevronDown />
                            </div>
                            <div className='cursor-pointer py-2'>Blog</div>
                            <div className='cursor-pointer py-2'>Contact</div>
                            
                            {/* User Actions moved inside mobile menu */}
                            <div className='border-t border-gray-600 pt-4'>
                                <div className='flex items-center justify-between cursor-pointer py-2'>
                                    <span>USD</span>
                                    <LuChevronDown />
                                </div>
                                <div className='flex items-center justify-between cursor-pointer py-2'>
                                    <span>EN</span>
                                    <LuChevronDown />
                                </div>
                                
                                {/* User Profile and Search inside mobile menu */}
                                <div className='flex items-center gap-4 pt-3 border-t border-gray-600 mt-2'>
                                    <div className='flex items-center gap-2 cursor-pointer py-2'>
                                        <LuUserRound className="text-lg" />
                                        <span>Profile</span>
                                    </div>
                                    <div className='flex items-center gap-2 cursor-pointer py-2'>
                                        <HiOutlineMagnifyingGlass className="text-lg" />
                                        <span>Search</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Banner Content - Text Only Animations */}
            {isHomePage && (
                <div className="relative z-10 flex flex-col items-center justify-center text-center text-white min-h-[70vh] px-4 max-w-[90%] mx-auto">
                    <h1 
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-bold mb-4 drop-shadow-lg text-center uppercase"
                        data-aos="slide-down"
                        data-aos-delay="200"
                        data-aos-duration="800"
                    >
                        Discover Sparkle 
                    </h1>
                    <h1 
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-bold mb-4 drop-shadow-lg text-center uppercase"
                        data-aos="slide-up"
                        data-aos-delay="400"
                        data-aos-duration="800"
                    >
                         With Style
                    </h1>
                    <p 
                        className="text-lg sm:text-xl md:text-2xl mb-8 drop-shadow-md max-w-2xl"
                        data-aos="fade-in"
                        data-aos-delay="600"
                        data-aos-duration="1000"
                    >
                       Whether casual or formal , find the perfect jewelry for every occasion.
                    </p>
                    <button 
                        className="bg-transparent text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 transition duration-300 transform hover:scale-105 text-sm sm:text-base border-t-2 border-b-2 border-r border-l"
                        data-aos="bounce-in"
                        data-aos-delay="800"
                        data-aos-duration="600"
                    >
                        Shop Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar;