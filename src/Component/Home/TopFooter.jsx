import React from "react";
import one from "../../assets/TopFooter/one.webp";
import two from "../../assets/TopFooter/two.png";
import three from "../../assets/TopFooter/three.webp";
import four from "../../assets/TopFooter/four.webp";

const TopFooter = () => {
  return (
    <div className="max-w-[90%] mx-auto mt-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <img 
        className="w-full h-64 object-cover" 
        src={one} 
        alt="Ring" 
        data-aos="zoom-in"
        data-aos-delay="100"
      />
      <img 
        className="w-full h-64 object-cover" 
        src={two} 
        alt="Ring" 
        data-aos="fade-up"
        data-aos-delay="200"
      />
      <img 
        className="w-full h-64 object-cover" 
        src={three} 
        alt="Ring" 
        data-aos="fade-down"
        data-aos-delay="300"
      />
      <img 
        className="w-full h-64 object-cover" 
        src={four} 
        alt="Ring" 
        data-aos="zoom-out"
        data-aos-delay="400"
      />
    </div>
  );
};

export default TopFooter;