import React from 'react';
import { CiDeliveryTruck } from 'react-icons/ci';
import { FaPeopleCarryBox } from 'react-icons/fa6';
import { MdLockOutline } from 'react-icons/md';
import { RiVipDiamondLine } from 'react-icons/ri';

const Services = () => {
    return (
        <div className='max-w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-8 md:mt-16 px-4 sm:px-0'>
            {/* Service Item 1 */}
            <div 
                className='flex flex-col items-center text-center p-4 md:p-6 hover:bg-neutral-50 rounded-lg transition-colors duration-200'
                data-aos="fade-up"
                data-aos-delay="100"
            >
                <RiVipDiamondLine 
                    className='bg-neutral-100 text-orange-800 rounded-full h-12 w-12 md:h-14 md:w-14 p-3 flex items-center justify-center'
                    data-aos="zoom-in"
                    data-aos-delay="200"
                />
                <h2 
                    className='font-semibold mt-3 md:mt-4 text-lg md:text-xl'
                    data-aos="fade-up"
                    data-aos-delay="300"
                >
                    Quality Certified
                </h2>
                <p 
                    className='text-gray-500 text-sm mt-1 md:mt-2'
                    data-aos="fade-up"
                    data-aos-delay="400"
                >
                    Available certificates of Authenticity
                </p>
            </div>
            
            {/* Service Item 2 */}
            <div 
                className='flex flex-col items-center text-center p-4 md:p-6 hover:bg-neutral-50 rounded-lg transition-colors duration-200'
                data-aos="fade-up"
                data-aos-delay="200"
            >
                <MdLockOutline 
                    className='bg-neutral-100 text-orange-800 rounded-full h-12 w-12 md:h-14 md:w-14 p-3 flex items-center justify-center'
                    data-aos="zoom-in"
                    data-aos-delay="300"
                />
                <h2 
                    className='font-semibold mt-3 md:mt-4 text-lg md:text-xl'
                    data-aos="fade-up"
                    data-aos-delay="400"
                >
                    Secure Transaction
                </h2>
                <p 
                    className='text-gray-500 text-sm mt-1 md:mt-2'
                    data-aos="fade-up"
                    data-aos-delay="500"
                >
                    Certified Marketplace still 2017
                </p>
            </div>
            
            {/* Service Item 3 */}
            <div 
                className='flex flex-col items-center text-center p-4 md:p-6 hover:bg-neutral-50 rounded-lg transition-colors duration-200'
                data-aos="fade-up"
                data-aos-delay="300"
            >
                <CiDeliveryTruck 
                    className='bg-neutral-100 text-orange-800 rounded-full h-12 w-12 md:h-14 md:w-14 p-3 flex items-center justify-center'
                    data-aos="zoom-in"
                    data-aos-delay="400"
                />
                <h2 
                    className='font-semibold mt-3 md:mt-4 text-lg md:text-xl'
                    data-aos="fade-up"
                    data-aos-delay="500"
                >
                    Free Shipping
                </h2>
                <p 
                    className='text-gray-500 text-sm mt-1 md:mt-2'
                    data-aos="fade-up"
                    data-aos-delay="600"
                >
                    Free, Fast And Reliable Worldwide
                </p>
            </div>
            
            {/* Service Item 4 */}
            <div 
                className='flex flex-col items-center text-center p-4 md:p-6 hover:bg-neutral-50 rounded-lg transition-colors duration-200'
                data-aos="fade-up"
                data-aos-delay="400"
            >
                <FaPeopleCarryBox 
                    className='bg-neutral-100 text-orange-800 rounded-full h-12 w-12 md:h-14 md:w-14 p-3 flex items-center justify-center'
                    data-aos="zoom-in"
                    data-aos-delay="500"
                />
                <h2 
                    className='font-semibold mt-3 md:mt-4 text-lg md:text-xl'
                    data-aos="fade-up"
                    data-aos-delay="600"
                >
                    Transparent Services
                </h2>
                <p 
                    className='text-gray-500 text-sm mt-1 md:mt-2'
                    data-aos="fade-up"
                    data-aos-delay="700"
                >
                    Satisfying hassle-free return policy
                </p>
            </div>
        </div>
    );
};

export default Services;