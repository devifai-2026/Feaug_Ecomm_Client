import React from "react";
import ring from "../../assets/BottomBanner/ring.png";

const TopFooter = () => {
  return (
    <div className="max-w-[90%] mx-auto mt-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
      <img 
        className="w-full h-64 object-cover" 
        src={ring} 
        alt="Ring" 
        data-aos="zoom-in"
        data-aos-delay="100"
      />
      <img 
        className="w-full h-64 object-cover" 
        src={ring} 
        alt="Ring" 
        data-aos="fade-up"
        data-aos-delay="200"
      />
      <img 
        className="w-full h-64 object-cover" 
        src={ring} 
        alt="Ring" 
        data-aos="fade-down"
        data-aos-delay="300"
      />
      <img 
        className="w-full h-64 object-cover" 
        src={ring} 
        alt="Ring" 
        data-aos="zoom-out"
        data-aos-delay="400"
      />
    </div>
  );
};

export default TopFooter;