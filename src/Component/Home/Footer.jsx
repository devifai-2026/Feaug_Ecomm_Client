import React from 'react';
import { FiPhoneCall } from 'react-icons/fi';
import { IoLocationOutline } from 'react-icons/io5';
import { MdOutlineMailOutline } from 'react-icons/md';

const Footer = () => {
    return (
        <div className="font-sans text-gray-800 mt-12 mb-12 max-w-[90%] mx-auto">
            {/* Main Footer Content */}
            <div className="flex flex-col md:flex-row flex-wrap justify-between gap-6 sm:gap-8 bg-stone-100 p-6 sm:p-8 lg:p-10">
                
                {/* Contact Info Section - Full width on sm, part of first row on md */}
                <div className="w-full md:w-auto md:flex-1 min-w-[250px] text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-800">
                        FEAUAG
                    </div>
                    <div className="text-gray-600 leading-relaxed space-y-3">
                        <div className='text-sm flex items-start gap-2 justify-center sm:justify-start group cursor-pointer'>
                            <IoLocationOutline className="text-orange-900 h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                            <span className="break-words transition-transform duration-300 group-hover:scale-105">123 Main Street Chicago, IL <br />60601 United States</span>
                        </div>
                        <div className="text-sm flex items-center gap-2 justify-center sm:justify-start group cursor-pointer">
                            <FiPhoneCall className="text-orange-900 h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"/>
                            <span className="transition-transform duration-300 group-hover:scale-105">+1 (234) 567 890</span>
                        </div>
                        <div className='text-sm flex items-center gap-2 justify-center sm:justify-start group cursor-pointer'>
                            <MdOutlineMailOutline className="text-orange-900 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"/>
                            <span className="transition-transform duration-300 group-hover:scale-105">support@axels.com</span>
                        </div>
                    </div>
                </div>

                {/* Company and Support Links - Flex row on sm, part of first row on md */}
                <div className="w-full sm:flex sm:justify-around md:flex-1 md:flex-row md:justify-between lg:justify-around">
                    {/* Company Links */}
                    <div className="flex-1 min-w-[150px] mb-6 sm:mb-0 text-center sm:text-left">
                        <div className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-800">
                            Company
                        </div>
                        <div className="flex flex-col gap-2 text-gray-600">
                            <div className='group text-xs sm:text-sm hover:text-gray-800 cursor-pointer transition-all duration-300 hover:scale-105'>About Us</div>
                            <div className='group text-xs sm:text-sm hover:text-gray-800 cursor-pointer transition-all duration-300 hover:scale-105'>Testimonials</div>
                            <div className='group text-xs sm:text-sm hover:text-gray-800 cursor-pointer transition-all duration-300 hover:scale-105'>FAQs</div>
                            <div className='group text-xs sm:text-sm hover:text-gray-800 cursor-pointer transition-all duration-300 hover:scale-105'>Terms & Condition</div>
                            <div className='group text-xs sm:text-sm hover:text-gray-800 cursor-pointer transition-all duration-300 hover:scale-105'>Latest Update</div>
                        </div>
                    </div>

                    {/* Support Links */}
                    <div className="flex-1 min-w-[150px] text-center sm:text-left">
                        <div className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-800">
                            Support
                        </div>
                        <div className="flex flex-col gap-2 text-gray-600">
                            <div className='group text-xs sm:text-sm hover:text-gray-800 cursor-pointer transition-all duration-300 hover:scale-105'>Order Tracking</div>
                            <div className='group text-xs sm:text-sm hover:text-gray-800 cursor-pointer transition-all duration-300 hover:scale-105'>Payment Guide</div>
                            <div className='group text-xs sm:text-sm hover:text-gray-800 cursor-pointer transition-all duration-300 hover:scale-105'>Help Centre</div>
                            <div className='group text-xs sm:text-sm hover:text-gray-800 cursor-pointer transition-all duration-300 hover:scale-105'>Privacy Policy</div>
                            <div className='group text-xs sm:text-sm hover:text-gray-800 cursor-pointer transition-all duration-300 hover:scale-105'>Return Policy</div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section - Full width on sm, second row on md */}
                <div className="w-full md:w-full lg:flex-1 lg:w-auto min-w-[250px] text-center sm:text-left mt-6 md:mt-0">
                    <div className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-800">
                        Newsletter
                    </div>
                    <div className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">
                        Get our latest updates and promo bi-monthly.
                    </div>
                    <input 
                        type="email" 
                        placeholder="Enter your email address"
                        className="w-full max-w-xs mx-auto md:mx-0 border-b border-gray-300 bg-transparent px-1 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-gray-600 text-xs sm:text-sm transition-all duration-300 hover:scale-105 focus:scale-105"
                    />
                    <button className='group bg-[#C19A6B] mt-4 px-4 py-3 w-[75%] md:w-[45%] lg:w-[75%] text-center uppercase text-white ml-0 md:ml-3 lg:ml-0 transition-all duration-300 hover:scale-105'>
                        <span className='transition-transform duration-300 group-hover:scale-105'>Subscribe</span>
                    </button>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="max-w-6xl mx-auto mt-4 sm:mt-6 pt-4 sm:pt-5">
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm justify-center sm:justify-start">
                    <div className='group border-r-2 border-gray-300 pr-2 sm:pr-4 hover:text-gray-600 cursor-pointer transition-all duration-300 hover:scale-105'>Privacy Policy</div>
                    <div className='group border-r-2 border-gray-300 pr-2 sm:pr-4 hover:text-gray-600 cursor-pointer transition-all duration-300 hover:scale-105'>Terms & Condition</div>
                    <div className='group hover:text-gray-600 cursor-pointer transition-all duration-300 hover:scale-105'>Sitemap</div>
                </div>
            </div>
        </div>
    );
};

export default Footer;