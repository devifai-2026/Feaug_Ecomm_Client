import React from 'react';
import { FiPhoneCall } from 'react-icons/fi';
import { IoLocationOutline } from 'react-icons/io5';
import { MdOutlineMailOutline } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    const isProductDetailsPage = location.pathname.includes('/product/');
    
    return (
        <div className={` mt-16 mb-16 max-w-[90%] mx-auto ${
            isProductDetailsPage 
                ? 'text-white' 
                : 'text-gray-800'
        }`}>
            {/* Main Footer Content */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between gap-6 lg:gap-8 p-8 sm:p-10 lg:p-12 ${
                isProductDetailsPage 
                    ? 'bg-gray-900 border-gray-800' 
                    : 'bg-stone-100 border-gray-200'
            }  shadow-sm`}>
                
                {/* Contact Info Section */}
                <div className="w-full lg:w-auto lg:flex-1 min-w-[250px] text-center sm:text-left">
                    <div className={`text-3xl md:text-4xl font-bold mb-8 sm:mb-10 ${
                        isProductDetailsPage 
                            ? 'text-white' 
                            : 'text-gray-800'
                    }`}>
                        FEAUAG
                    </div>
                    <div className={`leading-relaxed space-y-4 ${
                        isProductDetailsPage 
                            ? 'text-gray-300' 
                            : 'text-gray-600'
                    }`}>
                        <div className='text-sm flex items-start gap-2 justify-center sm:justify-start group cursor-pointer'>
                            <IoLocationOutline className={`${
                                isProductDetailsPage 
                                    ? 'text-orange-300' 
                                    : 'text-orange-900'
                            } h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110`} />
                            <span className="break-words transition-transform duration-300 group-hover:scale-105">
                                123 Main Street Chicago, IL <br />60601 United States
                            </span>
                        </div>
                        <div className="text-sm flex items-center gap-2 justify-center sm:justify-start group cursor-pointer">
                            <FiPhoneCall className={`${
                                isProductDetailsPage 
                                    ? 'text-orange-300' 
                                    : 'text-orange-900'
                            } h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}/>
                            <span className="transition-transform duration-300 group-hover:scale-105">
                                +1 (234) 567 890
                            </span>
                        </div>
                        <div className='text-sm flex items-center gap-2 justify-center sm:justify-start group cursor-pointer'>
                            <MdOutlineMailOutline className={`${
                                isProductDetailsPage 
                                    ? 'text-orange-300' 
                                    : 'text-orange-900'
                            } h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}/>
                            <span className="transition-transform duration-300 group-hover:scale-105">
                                support@axels.com
                            </span>
                        </div>
                    </div>
                </div>

                {/* Company Links */}
                <div className="w-full lg:w-auto lg:flex-1 min-w-[150px] text-center sm:text-left">
                    <div className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 ${
                        isProductDetailsPage 
                            ? 'text-white' 
                            : 'text-gray-800'
                    }`}>
                        Company
                    </div>
                    <div className={`flex flex-col gap-4 ${
                        isProductDetailsPage 
                            ? 'text-gray-300 hover:text-white' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`}>
                        <div className='group text-xs sm:text-sm cursor-pointer transition-all duration-300 hover:scale-105'>
                            About Us
                        </div>
                        <Link to="/testimonials">  
                            <div className='group text-xs sm:text-sm cursor-pointer transition-all duration-300 hover:scale-105'>
                                Testimonials
                            </div>
                        </Link>
                        <div className='group text-xs sm:text-sm cursor-pointer transition-all duration-300 hover:scale-105'>
                            FAQs
                        </div>
                        <Link to="/terms-condition">  
                            <div className='group text-xs sm:text-sm cursor-pointer transition-all duration-300 hover:scale-105'>
                                Terms & Conditions
                            </div>
                        </Link>
                        <div className='group text-xs sm:text-sm cursor-pointer transition-all duration-300 hover:scale-105'>
                            Latest Update
                        </div>
                    </div>
                </div>

                {/* Support Links */}
                <div className="w-full lg:w-auto lg:flex-1 min-w-[150px] text-center sm:text-left">
                    <div className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 ${
                        isProductDetailsPage 
                            ? 'text-white' 
                            : 'text-gray-800'
                    }`}>
                        Support
                    </div>
                    <div className={`flex flex-col gap-4 ${
                        isProductDetailsPage 
                            ? 'text-gray-300 hover:text-white' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`}>
                        <div className='group text-xs sm:text-sm cursor-pointer transition-all duration-300 hover:scale-105'>
                            Order Tracking
                        </div>
                        <div className='group text-xs sm:text-sm cursor-pointer transition-all duration-300 hover:scale-105'>
                            Payment Guide
                        </div>
                        <Link to="/helpCenter"> 
                            <div className='group text-xs sm:text-sm cursor-pointer transition-all duration-300 hover:scale-105'>
                                Help Centre
                            </div>
                        </Link>
                        <Link to="/privacyPolicy"> 
                            <div className='group text-xs sm:text-sm cursor-pointer transition-all duration-300 hover:scale-105'>
                                Privacy Policy
                            </div>
                        </Link>
                        <Link to="/returnPolicy"> 
                            <div className='group text-xs sm:text-sm cursor-pointer transition-all duration-300 hover:scale-105'>
                                Return Policy
                            </div>
                        </Link>   
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="w-full lg:w-auto lg:flex-1 min-w-[250px] text-center sm:text-left">
                    <div className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 ${
                        isProductDetailsPage 
                            ? 'text-white' 
                            : 'text-gray-800'
                    }`}>
                        Newsletter
                    </div>
                    <div className={`mb-4 sm:mb-6 text-xs sm:text-sm ${
                        isProductDetailsPage 
                            ? 'text-gray-300' 
                            : 'text-gray-600'
                    }`}>
                        Get our latest updates and promo bi-monthly.
                    </div>
                    <input 
                        type="email" 
                        placeholder="Enter your email address"
                        className={`w-full max-w-xs mx-auto md:mx-0 border-b bg-transparent px-1 py-3 placeholder-gray-400 focus:outline-none text-xs sm:text-sm transition-all duration-300 hover:scale-105 focus:scale-105 ${
                            isProductDetailsPage 
                                ? 'border-gray-600 text-white focus:border-white placeholder-gray-500' 
                                : 'border-gray-300 text-gray-600 focus:border-gray-600 placeholder-gray-400'
                        }`}
                    />
                    <button className={`group mt-6 px-4 py-4 w-[75%] md:w-[45%] lg:w-[85%] max-w-xs mx-auto md:mx-0 text-center uppercase transition-all duration-300 hover:scale-105 ${
                        isProductDetailsPage 
                            ? 'bg-[#C19A6B] text-white hover:bg-[#B08B5C]' 
                            : 'bg-[#C19A6B] text-white hover:bg-[#B08B5C]'
                    }`}>
                        <span className='transition-transform duration-300 group-hover:scale-105'>
                            Subscribe
                        </span>
                    </button>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="max-w-6xl mx-auto mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                <div className={`flex flex-wrap gap-3 sm:gap-5 text-xs sm:text-sm justify-center sm:justify-start ${
                    isProductDetailsPage 
                        ? 'text-gray-400 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-800'
                }`}>
                    <div className={`group pr-3 sm:pr-5 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        isProductDetailsPage 
                            ? 'border-r border-gray-700' 
                            : 'border-r-2 border-gray-300'
                    }`}>
                        Privacy Policy
                    </div>
                    <div className={`group pr-3 sm:pr-5 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        isProductDetailsPage 
                            ? 'border-r border-gray-700' 
                            : 'border-r-2 border-gray-300'
                    }`}>
                        Terms & Condition
                    </div>
                    <div className='group cursor-pointer transition-all duration-300 hover:scale-105'>
                        Sitemap
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;