import React from "react";
import ring from "../../assets/BottomBanner/ring.png";

const TopFooter = () => {
  return (
    <div className="w-full">
      <div className="max-w-[90%] mx-auto mt-8 sm:mt-12 lg:mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <img 
            className="w-full h-48 sm:h-60 lg:h-72 object-cover shadow-sm hover:shadow-md transition-shadow duration-300" 
            src={ring} 
            alt="Ring" 
            data-aos="fade-up"
            data-aos-delay="100"
          />
          <img 
            className="w-full h-48 sm:h-60 lg:h-72 object-cover shadow-sm hover:shadow-md transition-shadow duration-300" 
            src={ring} 
            alt="Ring" 
            data-aos="fade-up"
            data-aos-delay="200"
          />
          <img 
            className="w-full h-48 sm:h-60 lg:h-72 object-cover shadow-sm hover:shadow-md transition-shadow duration-300" 
            src={ring} 
            alt="Ring" 
            data-aos="fade-up"
            data-aos-delay="300"
          />
          <img 
            className="w-full h-48 sm:h-60 lg:h-72 object-cover shadow-sm hover:shadow-md transition-shadow duration-300" 
            src={ring} 
            alt="Ring" 
            data-aos="fade-up"
            data-aos-delay="400"
          />
        </div>
      </div>
    </div>
  );
};

export default TopFooter;