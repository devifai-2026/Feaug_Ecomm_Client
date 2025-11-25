import React from 'react';
import banner from "../../assets/cleopatra/freepik__design-editorial-soft-studio-light-photography-hig__70850.png";
import { GiLindenLeaf } from 'react-icons/gi';
import one from "../../assets/cleopatra/one.webp"
import two from "../../assets/cleopatra/two.avif"
import { FaArrowRightLong } from 'react-icons/fa6';
import { RxDividerVertical } from 'react-icons/rx';

const CleopatraGlam = () => {
    return (
        <div className='max-w-[90%] mx-auto mt-8 md:mt-16'>
           {/* Banner Section */}
           <div className='relative group cursor-pointer overflow-hidden'>
             <img 
  className='w-full h-[40vh] md:h-[50vh] lg:h-[60vh] object-cover transition-transform duration-500 group-hover:scale-105 opacity-50 md:opacity-70 lg:opacity-100' 
  src={banner} 
  alt="" 
/>
              <div className='space-y-2 md:space-y-3 max-w-[240px] md:max-w-xs lg:max-w-md absolute right-2 md:right-5 top-1/2 transform -translate-y-1/2 p-4 md:p-0 text-right md:text-right lg:text-left'>
                <p className='text-gray-700 text-sm md:text-base flex items-center gap-2 justify-end lg:justify-start'>Collection <RxDividerVertical /></p>
               <div className='flex justify-end lg:justify-start'>
                   <GiLindenLeaf className='text-2xl md:text-3xl lg:text-4xl ' />
               </div>
                <h2 className='text-xl md:text-2xl lg:text-3xl'>Cleopatra Glam</h2>
                <p className='text-gray-900 text-xs md:text-sm lg:text-base'>Introducing our new mesmerizing jewellery collection.Embarace your inner allure with the timeless elegance and radiant beauty of ancient Egypt, now available exclusive on AXELS jewelry</p>
                <button className='border-black border-2 px-2 py-1 md:px-3 md:py-2 bg-transparent text-sm md:text-base md:w-[40%]  text-nowrap'>SHOP NOW</button>
              </div>
           </div>
            
            {/* Cards Section */}
            <div className='flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-6'>
               <div className='flex items-center justify-around w-full md:flex-1 bg-slate-200 py-2  md:py-5 lg:py-3 px-4 md:px-0'>
                  <div className='space-y-1 md:space-y-2'>
                    <h1 className='text-xl md:text-4xl lg:text-4xl text-nowrap mr-2 md:mr-0 transition-transform duration-300 group-hover:scale-105'>Luxe Abundance</h1>
                    <p className='text-gray-500 text-xs md:text-base lg:text-sm transition-opacity duration-300 group-hover:opacity-80'>Get 20% off with our code: LUX20</p>
                    <p className='mt-3 md:mt-5 flex items-center gap-2 md:gap-3 text-sm md:text-base transition-transform duration-300 group-hover:translate-x-1'>
                        Redeem Code 
                        <FaArrowRightLong className='text-amber-950 transition-transform duration-300 group-hover:translate-x-1' />
                    </p>
                  </div>
                  <img src={one} className='w-16 h-16 md:w-24 md:h-24 lg:w-44 lg:h-32' />
               </div>
               
               <div className='flex items-center justify-around w-full md:flex-1 bg-zinc-300 py-2  md:py-5 lg:py-3 px-4 md:px-0'>
                  <div className='space-y-1 md:space-y-2'>
                    <h1 className='text-xl md:text-4xl lg:text-4xl mr-2 md:mr-0 transition-transform duration-300 group-hover:scale-105'>Sparkle in Love</h1>
                    <p className='text-gray-500 text-xs md:text-base lg:text-sm transition-opacity duration-300 group-hover:opacity-80'>Get 50% off on rings</p>
                    <p className='mt-3 md:mt-5 flex items-center gap-2 md:gap-3 text-sm md:text-base transition-transform duration-300 group-hover:translate-x-1'>
                        View Products 
                        <FaArrowRightLong className='text-amber-950 transition-transform duration-300 group-hover:translate-x-1' />
                    </p>
                  </div>
                  <img src={two} className='w-16 h-16 md:w-24 md:h-24 lg:w-44 lg:h-32 ' />
               </div>
            </div>
        </div>
    );
};

export default CleopatraGlam;