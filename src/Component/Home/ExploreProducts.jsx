import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import one from "../../assets/ExploreProducts/one.webp"
import two from "../../assets/ExploreProducts/two.webp"
import three from "../../assets/ExploreProducts/three.webp"
import four from "../../assets/ExploreProducts/four.jpeg"
import five from "../../assets/ExploreProducts/five.webp"

const ExploreProducts = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);
  const autoScrollRef = useRef(null);
  const navigate = useNavigate();

  const products = [
    {
      label: 'BRACELETS',
      image: one
    },
    {
      label: 'EARRINGS',
      image: two
    },
    {
      label: 'RINGS',
      subtitle: 'All-time favorite',
      image: three
    },
    {
      label: 'NECKLACES',
      image: four
    },
    {
      label: 'WATCHES',
      image: five
    },
  ];

  // Handle card click navigation
  const handleCardClick = () => {
    navigate('/categories');

    // Optional: If you want to pass specific category data
    // navigate('/categories', { state: { selectedCategory: productLabel } });
  };

  // Auto scroll functionality
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    let isUserScrolling = false;
    let scrollTimeout;

    const handleUserScroll = () => {
      isUserScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 1000);
    };

    // Auto scroll function
    const autoScroll = () => {
      if (isUserScrolling) return;

      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const maxScrollLeft = scrollWidth - clientWidth;

      if (container.scrollLeft >= maxScrollLeft) {
        // If at the end, scroll back to start
        container.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
        setCurrentSlide(0);
      } else {
        // Scroll to next card
        const nextSlide = (currentSlide + 1) % products.length;
        const cardWidth = 256; // w-64 = 256px
        const gap = 16; // space-x-4 = 16px
        const scrollPosition = nextSlide * (cardWidth + gap);

        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
        setCurrentSlide(nextSlide);
      }
    };

    // Set up auto scroll interval
    autoScrollRef.current = setInterval(autoScroll, 3000);

    // Add scroll event listener
    scrollContainer.addEventListener('scroll', handleUserScroll);

    // Clean up
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
      scrollContainer.removeEventListener('scroll', handleUserScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentSlide, products.length]);

  // Handle manual scroll to update current slide
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = 256; // w-64 = 256px
    const gap = 16; // space-x-4 = 16px
    const newSlide = Math.round(scrollLeft / (cardWidth + gap));

    if (newSlide !== currentSlide && newSlide >= 0 && newSlide < products.length) {
      setCurrentSlide(newSlide);
    }
  };

  return (
    <div className='max-w-[90%] mx-auto mt-8 sm:mt-12 md:mt-16'>
      <h2
        className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-light mb-8 sm:mb-10 md:mb-12'
        data-aos="fade-down"
        data-aos-delay="100"
        data-aos-duration="800"
      >
        Explore Products
      </h2>

      {/* Mobile Design - Horizontal Scroll with auto-scroll */}
      <div className='block sm:hidden'>
        <div className='relative'>
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className='flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4 scroll-smooth hide-scrollbar'
            style={{ scrollBehavior: 'smooth' }}
          >
            {products.map((product, index) => (
              <div
                key={index}
                className='relative flex-shrink-0 w-64 h-80 snap-center cursor-pointer'
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                data-aos-duration="600"
                onClick={handleCardClick} // Added click handler
              >
                <img
                  src={product.image}
                  alt={product.label}
                  className='w-full h-full object-cover'
                />

                {/* Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>

                {/* Content - ALWAYS VISIBLE NOW */}
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

                  {/* Shop Now Button - ALWAYS VISIBLE NOW */}
                  <div className='mt-4' onClick={(e) => e.stopPropagation()}>
                    <button
                      className='w-full py-3 border border-white text-white text-sm font-light tracking-wide bg-white/10 hover:bg-white hover:text-black transition-all duration-300'
                      onClick={handleCardClick} // Button also navigates
                    >
                      SHOP NOW
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const container = scrollContainerRef.current;
                  if (container) {
                    const cardWidth = 256;
                    const gap = 16;
                    const scrollPosition = index * (cardWidth + gap);
                    container.scrollTo({
                      left: scrollPosition,
                      behavior: 'smooth'
                    });
                    setCurrentSlide(index);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'bg-black w-4'
                  : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Design */}
      <div
        className='hidden sm:flex items-center justify-between gap-3 md:gap-4 lg:gap-6'
        data-aos="fade-up"
        data-aos-delay="200"
        data-aos-duration="1000"
      >
        {products.map((product, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={handleCardClick} // Added click handler
            className={`relative overflow-hidden transition-all duration-500 ease-out cursor-pointer flex-1 ${index % 2 === 1 ? 'mt-8 sm:mt-10 md:mt-14' : ''
              }`}
            style={{
              flex: hoveredIndex === index ? '1.2' : '1',
              height: '70vh',
              transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              minWidth: '0',
            }}
            data-aos="fade-up"
            data-aos-delay={index * 150 + 300}
            data-aos-duration="800"
          >
            {/* Responsive height for different screens */}
            <div className="hidden sm:block md:hidden">
              <div
                style={{
                  width: '100%',
                  height: '60vh',
                }}
                data-aos="zoom-in"
                data-aos-delay={index * 100 + 400}
              >
                <img
                  src={product.image}
                  alt={product.label}
                  className='w-full h-full object-cover transition-transform duration-500 ease-out'
                  style={{
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                />
              </div>
            </div>

            <div className="hidden md:block lg:hidden">
              <div
                style={{
                  width: '100%',
                  height: '65vh',
                }}
                data-aos="zoom-in"
                data-aos-delay={index * 100 + 400}
              >
                <img
                  src={product.image}
                  alt={product.label}
                  className='w-full h-full object-cover transition-transform duration-500 ease-out'
                  style={{
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                />
              </div>
            </div>

            <div className="hidden lg:block">
              <div
                style={{
                  width: '100%',
                  height: '70vh',
                }}
                data-aos="zoom-in"
                data-aos-delay={index * 100 + 400}
              >
                <img
                  src={product.image}
                  alt={product.label}
                  className='w-full h-full object-cover transition-transform duration-500 ease-out'
                  style={{
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                />
              </div>
            </div>

            {/* Text overlay */}
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              {hoveredIndex === index && (
                <div
                  className='text-center'
                  style={{
                    transition: 'all 0.3s ease-out',
                    animation: 'fadeIn 0.3s ease-out',
                  }}
                >
                  <h3
                    className='text-white font-light tracking-wider text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3'
                    style={{
                      animation: 'slideDown 0.3s ease-out 0.1s both',
                    }}
                  >
                    {product.label}
                  </h3>
                  {product.subtitle && (
                    <p
                      className='text-white text-xs sm:text-sm font-light mb-4 sm:mb-6'
                      style={{
                        animation: 'slideDown 0.3s ease-out 0.15s both',
                      }}
                    >
                      {product.subtitle}
                    </p>
                  )}
                  <button
                    className='px-4 sm:px-6 py-2 border border-white text-white text-xs font-light tracking-wide hover:bg-white hover:text-black transition-all duration-300 ease-out'
                    style={{
                      animation: 'zoomIn 0.3s ease-out 0.2s both',
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from firing
                      handleCardClick();
                    }}
                  >
                    SHOP NOW
                  </button>
                </div>
              )}
            </div>

            {/* Vertical text */}
            {hoveredIndex !== index && (
              <div
                className='absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white font-light tracking-wider'
                style={{
                  transition: 'all 0.3s ease-out',
                }}
              >
                {product.label.split('').map((char, i) => (
                  <div
                    key={i}
                    className='text-base sm:text-lg md:text-xl lg:text-2xl font-semibold leading-4 sm:leading-5 md:leading-5 lg:leading-6 text-center transition-all duration-200'
                    style={{
                      transition: 'all 0.2s ease-out',
                    }}
                  >
                    {char}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom CSS to hide scrollbar */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes zoomIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        /* Smooth scrolling */
        .scroll-smooth {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default ExploreProducts;