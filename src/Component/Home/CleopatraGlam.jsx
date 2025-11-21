import React from 'react';
import banner from "../../assets/cleopatra/freepik__design-editorial-soft-studio-light-photography-hig__70850.png";
import { GiEarrings, GiHeartNecklace, GiZigzagLeaf } from 'react-icons/gi';
import { FaArrowRightLong } from 'react-icons/fa6';
import { RxDividerVertical } from 'react-icons/rx';
import earrings from "../../assets/cleopatra/earrings.png"
import rings from "../../assets/cleopatra/rings.png"

const CleopatraGlam = () => {
    return (
        <div className='max-w-[90%] mx-auto mt-8 md:mt-16'>
           {/* Banner Section */}
           <div className='relative group cursor-pointer overflow-hidden'>
             <img 
                className='w-full h-[40vh] md:h-[50vh] lg:h-[60vh] object-cover transition-transform duration-500 group-hover:scale-105' 
                src={banner} 
                alt="" 
             />
              <div className='space-y-2 md:space-y-3 max-w-xs md:max-w-sm lg:max-w-md absolute right-2 md:right-5 top-1/2 transform -translate-y-1/2 p-4 md:p-0 text-right md:text-right lg:text-left'>
                <p className='text-gray-600 text-sm md:text-base flex items-center justify-end lg:justify-start gap-3 uppercase text-right '>Collection  <RxDividerVertical className="h-10 w-7" /></p>
               <div className='flex justify-end lg:justify-start'>
                   <GiZigzagLeaf className='h-12 w-12 text-gray-600 transition-transform duration-300 group-hover:scale-110'/>
               </div>
                <h2 className='text-xl md:text-2xl lg:text-3xl transition-transform duration-300 group-hover:scale-105'>Cleopatra Glam</h2>
                <p className='text-gray-600 text-xs md:text-sm lg:text-base transition-opacity duration-300 group-hover:opacity-90'>Introducing our new mesmerizing jewellery collection.Embarace your inner allure with the timeless elegance and radiant beauty of ancient Egypt, now available exclusive on AXELS jewelry</p>
                <button className='border-black border-2 px-2 py-1 md:px-3 md:py-2 bg-transparent text-sm md:text-base w-[38%] transition-all duration-300 hover:bg-black hover:text-white hover:scale-105'>
                    SHOP NOW
                </button>
              </div>
           </div>
            
            {/* Cards Section */}
            <div className='flex flex-col lg:flex-row items-center gap-3 mt-4 md:mt-6'>
               {/* First Card */}
               <div className='group cursor-pointer flex items-center justify-around w-full md:flex-1 bg-slate-200 py-6 md:py-2 lg:py-2 px-4 md:px-0 overflow-hidden transition-all duration-500 hover:shadow-lg'>
                  <div className='space-y-1 md:space-y-2'>
                    <h1 className='text-xl md:text-4xl lg:text-4xl text-nowrap mr-2 md:mr-0 transition-transform duration-300 group-hover:scale-105'>Luxe Abundance</h1>
                    <p className='text-gray-500 text-xs md:text-base lg:text-sm transition-opacity duration-300 group-hover:opacity-80'>Get 20% off with our code: LUX20</p>
                    <p className='mt-3 md:mt-5 flex items-center gap-2 md:gap-3 text-sm md:text-base transition-transform duration-300 group-hover:translate-x-1'>
                        Redeem Code 
                        <FaArrowRightLong className='text-amber-950 transition-transform duration-300 group-hover:translate-x-1' />
                    </p>
                  </div>
                <img 
                    className='h-36 md:w-44 lg:w-36 transition-transform duration-500 group-hover:scale-110' 
                    src={earrings} 
                    alt="" 
                />
               </div>
               
               {/* Second Card */}
               <div className='group cursor-pointer flex items-center justify-around w-full md:flex-1 bg-zinc-300 py-6 md:py-2 px-4 lg:py-2 md:px-0 overflow-hidden transition-all duration-500 hover:shadow-lg'>
                  <div className='space-y-1 md:space-y-2'>
                    <h1 className='text-xl md:text-4xl lg:text-4xl mr-2 md:mr-0 transition-transform duration-300 group-hover:scale-105'>Sparkle in Love</h1>
                    <p className='text-gray-500 text-xs md:text-base lg:text-sm transition-opacity duration-300 group-hover:opacity-80'>Get 50% off on rings</p>
                    <p className='mt-3 md:mt-5 flex items-center gap-2 md:gap-3 text-sm md:text-base transition-transform duration-300 group-hover:translate-x-1'>
                        View Products 
                        <FaArrowRightLong className='text-amber-950 transition-transform duration-300 group-hover:translate-x-1' />
                    </p>
                  </div>
                  <img 
                    className='h-36 md:w-44 lg:w-36 transition-transform duration-500 group-hover:scale-110' 
                    src={rings} 
                    alt="" 
                  />
               </div>
            </div>
        </div>
    );
};

export default CleopatraGlam;