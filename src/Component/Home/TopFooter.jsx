import React from "react";
import ring from "../../assets/BottomBanner/ring.png";

const TopFooter = () => {
  return (
    <div className="max-w-[90%] mx-auto mt-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
      <div 
        className="relative group cursor-pointer overflow-hidden"
        data-aos="zoom-in"
        data-aos-delay="100"
      >
        <img 
          className="w-full h-64 object-cover transition-all duration-300 group-hover:scale-105" 
          src={ring} 
          alt="Ring" 
        />
      </div>
      <div 
        className="relative group cursor-pointer overflow-hidden"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <img 
          className="w-full h-64 object-cover transition-all duration-300 group-hover:scale-105" 
          src={ring} 
          alt="Ring" 
        />
      </div>
      <div 
        className="relative group cursor-pointer overflow-hidden"
        data-aos="fade-down"
        data-aos-delay="300"
      >
        <img 
          className="w-full h-64 object-cover transition-all duration-300 group-hover:scale-105" 
          src={ring} 
          alt="Ring" 
        />
      </div>
      <div 
        className="relative group cursor-pointer overflow-hidden"
        data-aos="zoom-out"
        data-aos-delay="400"
      >
        <img 
          className="w-full h-64 object-cover transition-all duration-300 group-hover:scale-105" 
          src={ring} 
          alt="Ring" 
        />
      </div>
    </div>
  );
};

export default TopFooter;