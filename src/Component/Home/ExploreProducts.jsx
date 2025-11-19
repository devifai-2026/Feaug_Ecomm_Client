import React, { useState } from 'react';
import ring from "../../assets/cleopatra/ring.png"

const ExploreProducts = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const products = [
    { label: 'BRACELETS' },
    { label: 'EARRINGS' },
    { label: 'RINGS', subtitle: 'All-time favorite' },
    { label: 'NECKLACES' },
    { label: 'WATCHES' },
  ];

  return (
    <div className='max-w-[90%] mx-auto mt-8 sm:mt-12 md:mt-16'>
      <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-light mb-8 sm:mb-10 md:mb-12'>
        Explore Products
      </h2>

      {/* Mobile Design */}
      <div className='block sm:hidden'>
        <div className='relative'>
          <div className='flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-4 pb-4'>
            {products.map((product, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className='relative flex-shrink-0 w-64 h-80 snap-center transition-all duration-300 cursor-pointer'
              >
                <img
                  src={ring}
                  alt={product.label}
                  className='w-full h-full object-cover'
                />
                
                {/* Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
                
                {/* Content */}
                <div className='absolute bottom-0 left-0 right-0 p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-white font-light text-xl mb-1'>
                        {product.label}
                      </h3>
                      {product.subtitle && (
                        <p className='text-white/80 text-sm font-light'>
                          {product.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Shop Now Button - Show on hover for mobile */}
                  {hoveredIndex === index && (
                    <div className='mt-4'>
                      <button className='w-full py-3 border border-white text-white text-sm font-light tracking-wide hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm bg-white/10'>
                        SHOP NOW
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Design (Original) */}
      <div className='hidden sm:flex items-center justify-between gap-2 sm:gap-3'>
        {products.map((product, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`relative overflow-hidden transition-all duration-500 ease-out cursor-pointer ${
              index % 2 === 1 ? 'mt-8 sm:mt-10 md:mt-14' : ''
            }`}
            style={{
              width: hoveredIndex === index ? '256px' : '176px',
              height: '70vh',
            }}
          >
            {/* Responsive height for different screens */}
            <div className="hidden sm:block md:hidden">
              <div
                style={{
                  width: hoveredIndex === index ? '256px' : '176px',
                  height: '60vh',
                  transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <img
                  src={ring}
                  alt={product.label}
                  className='w-full h-full object-cover'
                />
              </div>
            </div>

            <div className="hidden md:block lg:hidden">
              <div
                style={{
                  width: hoveredIndex === index ? '256px' : '176px',
                  height: '65vh',
                  transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <img
                  src={ring}
                  alt={product.label}
                  className='w-full h-full object-cover'
                />
              </div>
            </div>

            <div className="hidden lg:block">
              <div
                style={{
                  width: hoveredIndex === index ? '256px' : '176px',
                  height: '70vh',
                  transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <img
                  src={ring}
                  alt={product.label}
                  className='w-full h-full object-cover'
                />
              </div>
            </div>

            {/* Text overlay - Removed gray background opacity */}
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              {hoveredIndex === index && (
                <div className='text-center'>
                  <h3 className='text-white font-light tracking-wider text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3'>
                    {product.label}
                  </h3>
                  {product.subtitle && (
                    <p className='text-white text-xs sm:text-sm font-light mb-4 sm:mb-6'>
                      {product.subtitle}
                    </p>
                  )}
                  <button className='px-4 sm:px-6 py-2 border border-white text-white text-xs font-light tracking-wide hover:bg-white hover:text-black transition-all duration-300'>
                    SHOP NOW
                  </button>
                </div>
              )}
            </div>

            {/* Vertical text - Fixed for md devices */}
            {hoveredIndex !== index && (
              <div className='absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white font-light tracking-wider'>
                {product.label.split('').map((char, i) => (
                  <div 
                    key={i} 
                    className='text-base sm:text-lg md:text-xl lg:text-2xl font-semibold leading-4 sm:leading-5 md:leading-5 lg:leading-6 text-center'
                  >
                    {char}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreProducts;