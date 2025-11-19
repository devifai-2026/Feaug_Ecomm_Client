import React from 'react';
import ring from "../../assets/BottomBanner/ring.png"

const BottomBanner = () => {
    return (
        <div className="max-w-[90%] mx-auto mt-16 grid grid-cols-3 md:grid-col-4 lg:grid-cols-6 gap-4">
           <img className='w-56 h-64' src={ring} alt="" />
           <img className='w-56 h-64' src={ring} alt="" />
           <img className='w-56 h-64' src={ring} alt="" />
           <img className='w-56 h-64' src={ring} alt="" />
           <img className='w-56 h-64' src={ring} alt="" />
           <img className='w-56 h-64' src={ring} alt="" />
        </div>
    );
};

export default BottomBanner;