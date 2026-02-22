import React from 'react';
import img from "../../assets/QuestionsUpdate/ringTwo.webp"
import imgTwo from "../../assets/QuestionsUpdate/ring.webp"
import { FaArrowRightLong } from 'react-icons/fa6';

const QuestionsUpdate = () => {
    return (
        <div className='max-w-[90%] mx-auto mt-16'>
            {/* Latest Update Section */}
            <div className='flex flex-col'>
                <h2 className='text-2xl font-bold mb-8 text-center'>Latest Updates</h2>
                <div className='space-y-6 '>
                    {/* First Article */}
                    <div 
                        className='relative group cursor-pointer overflow-hidden'
                    >
                        <div className='flex items-center gap-3'>
                            <div className='relative overflow-hidden'>
                                <img 
                                    className='h-60 md:h-40 w-40 object-cover transition-all duration-300 group-hover:scale-105' 
                                    src={imgTwo} 
                                    alt="Engagement ring" 
                                />
                            </div>
                            <div className='space-y-3 flex-1'>
                                <p className='uppercase text-orange-900 text-sm font-medium'>TIPS</p>
                                <p className='text-sm md:text-base uppercase font-semibold'>How to choose the perfect  Engagement ring for  Beloved one</p>
                                <div className='space-y-1'>
                                    <p className='text-gray-500 text-xs'>Jane Thompson</p>
                                    <p className='text-gray-500 text-xs'>May 10, 2023</p>
                                </div>
                            </div>
                        </div>
                        {/* Black Border - Show on hover */}
                        <div className="absolute inset-0 group-hover:border-2 border-black transition-all duration-300"></div>
                    </div>

                    {/* Second Article */}
                    <div 
                        className='relative group cursor-pointer overflow-hidden'
                    >
                        <div className='flex items-center gap-3'>
                            <div className='relative overflow-hidden'>
                                <img 
                                    className='h-60 md:h-40 w-40 object-cover transition-all duration-300 group-hover:scale-105' 
                                    src={img} 
                                    alt="Jewelry maintenance" 
                                />
                            </div>
                            <div className='space-y-3 flex-1'>
                                <p className='uppercase text-orange-900 text-sm font-medium'>GUIDE</p>
                                <p className='text-sm md:text-base uppercase font-semibold'>Caring for your jewelry: Maintenance & Cleaning Complete Guide</p>
                                <div className='space-y-1'>
                                    <p className='text-gray-500 text-xs'>Michael Davis</p>
                                    <p className='text-gray-500 text-xs'>February 5, 2023</p>
                                </div>
                            </div>
                        </div>
                        {/* Black Border - Show on hover */}
                        <div className="absolute inset-0 group-hover:border-2 border-black transition-all duration-300"></div>
                    </div>

                    {/* View All Articles Link */}
                    {/* <p 
                        className='flex items-center gap-2 mt-6 text-gray-700 cursor-pointer hover:text-orange-900 transition-colors font-bold'
                    >
                        View All Articles
                        <FaArrowRightLong className='text-orange-900'/>
                    </p> */}
                </div>
            </div>
        </div>
    );
};

export default QuestionsUpdate;