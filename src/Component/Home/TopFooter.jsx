import React from "react";
import ring from "../../assets/BottomBanner/ring.png";

const TopFooter = () => {
  return (
    <div className="w-full">
      <div className="max-w-[90%] mx-auto mt-16 flex flex-wrap justify-between gap-4">
        <img className="w-60 h-72 object-cover" src={ring} alt="Ring" />
        <img className="w-60 h-72 object-cover" src={ring} alt="Ring" />
        <img className="w-60 h-72 object-cover" src={ring} alt="Ring" />
        <img className="w-60 h-72 object-cover" src={ring} alt="Ring" />
      </div>
    </div>
  );
};

export default TopFooter;
