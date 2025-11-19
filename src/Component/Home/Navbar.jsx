import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
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
                `bg-cover bg-center bg-no-repeat min-h-[90vh]` : 
                ''
            }
            style={isHomePage ? { backgroundImage: `url(${banner})` } : {}}
        >
            {/* Navbar */}
            <nav className="relative z-30 px-4 py-4 lg:px-8">
                <div className="max-w-[90%] mx-auto flex justify-between items-center">
                    {/* Mobile Menu Button */}
                    <button 
                        className="lg:hidden text-white text-2xl"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <LuX /> : <LuMenu />}
                    </button>

                    {/* Left Section - Navigation Links (Desktop) */}
                    <div className='hidden lg:flex items-center gap-6 text-white'>
                        <div className='flex items-center gap-1 cursor-pointer group relative'>
                            <p>Categories</p>
                            <LuChevronDown className="text-sm transition-transform duration-200 group-hover:rotate-180" />
                        </div>
                        <div className='flex items-center gap-1 cursor-pointer group relative'>
                            <p>About</p>
                            <LuChevronDown className="text-sm transition-transform duration-200 group-hover:rotate-180" />
                        </div>
                        <p className='cursor-pointer'>Blog</p>
                        <p className='cursor-pointer'>Contact</p>
                    </div>

                    {/* Center Section - Logo */}
                    <div>
                        <h2 className='uppercase text-xl sm:text-2xl lg:text-3xl font-bold text-white font-playfair'>Feaug</h2>
                    </div>

                    {/* Right Section - User Actions */}
                    <div className='flex items-center gap-4 text-white'>
                        <div className='hidden sm:flex items-center gap-1 cursor-pointer group relative border-r-2 pr-3'>
                            <p>USD</p>
                            <LuChevronDown className="text-sm transition-transform duration-200 group-hover:rotate-180" />
                        </div>
                        
                        <div className='hidden sm:flex items-center gap-1 cursor-pointer group relative border-r-2 pr-3'>
                            <p>EN</p>
                            <LuChevronDown className="text-sm transition-transform duration-200 group-hover:rotate-180" />
                        </div>
                        
                        <div className='flex items-center gap-3'>
                            <LuUserRound className="text-xl cursor-pointer hover:text-gray-300 transition-colors" />
                            <BsHandbag className="text-xl cursor-pointer hover:text-gray-300 transition-colors" />
                            <HiOutlineMagnifyingGlass className="text-xl cursor-pointer hover:text-gray-300 transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - Fixed positioning */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-16 left-4 right-4 bg-black bg-opacity-95 text-white rounded-lg p-4 z-40 shadow-xl">
                        <div className="flex flex-col space-y-4">
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
                            <div className='flex items-center justify-between cursor-pointer border-t border-gray-600 pt-4 py-2'>
                                <span>USD</span>
                                <LuChevronDown />
                            </div>
                            <div className='flex items-center justify-between cursor-pointer py-2'>
                                <span>EN</span>
                                <LuChevronDown />
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Banner Content - Reduced z-index */}
            {isHomePage && (
                <div className="relative z-10 flex flex-col items-center justify-center text-center text-white min-h-[70vh] px-4 max-w-[90%] mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-bold mb-4 drop-shadow-lg text-center uppercase">
                        Discover Sparkle 
                    </h1>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-bold mb-4 drop-shadow-lg text-center uppercase">
                         With Style
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl mb-8 drop-shadow-md max-w-2xl">
                       Whether casual or formal , find the perfect jewelry for every occasion.
                    </p>
                    <button className="bg-transparent text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 transition duration-300 transform hover:scale-105 text-sm sm:text-base border-t-2 border-b-2 border-r border-l  ">
                        Shop Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar;