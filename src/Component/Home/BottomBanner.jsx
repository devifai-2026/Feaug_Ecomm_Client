import React from 'react';
import ring from "../../assets/BottomBanner/ring.png"

const BottomBanner = () => {
    return (
        <div className="max-w-[90%] mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           <img 
             className='w-full h-64 object-cover' 
             src={ring} 
             alt="" 
             data-aos="zoom-in"
             data-aos-delay="100"
           />
           <img 
             className='w-full h-64 object-cover' 
             src={ring} 
             alt="" 
             data-aos="fade-left"
             data-aos-delay="200"
           />
           <img 
             className='w-full h-64 object-cover' 
             src={ring} 
             alt="" 
             data-aos="fade-up"
             data-aos-delay="300"
           />
           <img 
             className='w-full h-64 object-cover' 
             src={ring} 
             alt="" 
             data-aos="fade-right"
             data-aos-delay="400"
           />
           <img 
             className='w-full h-64 object-cover' 
             src={ring} 
             alt="" 
             data-aos="flip-left"
             data-aos-delay="500"
           />
           <img 
             className='w-full h-64 object-cover' 
             src={ring} 
             alt="" 
             data-aos="flip-right"
             data-aos-delay="600"
           />
        </div>
    );
};

export default BottomBanner;