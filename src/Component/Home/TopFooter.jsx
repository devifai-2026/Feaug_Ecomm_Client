import React from "react";
import one from "../../assets/TopFooter/one.webp";
import two from "../../assets/TopFooter/two.png";
import three from "../../assets/TopFooter/three.webp";
import four from "../../assets/TopFooter/four.webp";

const TopFooter = () => {
  const categories = [
    { 
      image: one, 
      name: "Engagement Rings",
      aos: "zoom-in",
      delay: "100"
    },
    { 
      image: two, 
      name: "Wedding Bands",
      aos: "fade-up", 
      delay: "200"
    },
    { 
      image: three, 
      name: "Diamond Jewelry",
      aos: "fade-down",
      delay: "300"
    },
    { 
      image: four, 
      name: "Luxury Collection",
      aos: "zoom-out",
      delay: "400"
    }
  ];

  const instagramUrl = "https://www.instagram.com/feauag.official/";

  const openInstagram = () => {
    window.open(instagramUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-[90%] mx-auto mt-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category, index) => (
        <div 
          key={index}
          className="w-full h-64 overflow-hidden group relative cursor-pointer"
          data-aos={category.aos}
          data-aos-delay={category.delay}
          onClick={openInstagram}
        >
          <img 
            className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-110" 
            src={category.image} 
            alt={category.name} 
          />
          
          {/* Mobile & Tablet: Show Instagram name */}
          <div className="md:block lg:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white text-sm font-semibold text-center">
              @feauag.official
            </h3>
            <p className="text-white/80 text-xs text-center mt-1">Visit our Instagram</p>
          </div>
          
          {/* Desktop: Show Instagram name on hover */}
          <div className="hidden lg:flex absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 items-center justify-center">
            <div className="text-center transform translate-y-8 group-hover:translate-y-0 transition-all duration-500">
              <h3 className="text-white text-xl font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                @feauag.official
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopFooter;