import React from 'react';
import ring from "../../assets/BottomBanner/ring.png"

const BottomBanner = () => {
    const categories = [
        { title: "Earrings", animation: "zoom-in" },
        { title: "Necklace", animation: "fade-left" },
        { title: "Rings", animation: "fade-up" },
        { title: "Bracelets", animation: "fade-right" },
        { title: "Watches", animation: "flip-left" },
        { title: "Accessories", animation: "flip-right" }
    ];

    return (
        <div className="max-w-[90%] mx-auto mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
                <div 
                    key={index}
                    className="relative group cursor-pointer overflow-hidden"
                    data-aos={category.animation}
                    data-aos-delay={`${(index + 1) * 100}`}
                >
                    {/* Image */}
                    <img 
                        className='w-full h-64 object-cover transition-all duration-300 group-hover:scale-105 ' 
                        src={ring} 
                        alt={category.title} 
                    />
                    
                    {/* Title - Show on hover */}
                    <div className="absolute bottom-0 left-0 right-0  bg-opacity-70 p-3 transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
                        <h3 className="text-black text-center  text-lg uppercase tracking-widest">
                            {category.title}
                        </h3>
                    </div>

                    {/* Black Border - Show on hover */}
                    <div className="absolute inset-0 border border-transparent group-hover:border-black transition-all duration-300"></div>
                </div>
            ))}
        </div>
    );
};

export default BottomBanner;