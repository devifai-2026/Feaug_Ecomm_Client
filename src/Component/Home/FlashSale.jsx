import React from 'react';
import banner from "../../assets/cleopatra/freepik__design-editorial-soft-studio-light-photography-hig__70850.png"

const FlashSale = () => {
    return (
        <div 
            className="min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] bg-cover bg-center bg-no-repeat relative max-w-[90%] mx-auto mt-8 overflow-hidden"
            style={{
                backgroundImage: `url(${banner})`
            }}
        >
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${banner})`
                }}
            ></div>

            {/* Content positioned: lg right side y-center, sm center x and y */}
            <div 
                className="group-content absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-1/2 lg:left-auto lg:right-6 lg:translate-x-0 max-w-sm md:max-w-lg lg:max-w-xl bg-white p-4 sm:p-5 md:p-6"
            >
                <div className='border-2 border-yellow-800 border-opacity-35 p-4 sm:p-5 md:p-6'>
                    {/* Flash Sale Badge */}
                    <p 
                        className="text-xs sm:text-sm font-semibold tracking-wider text-center text-yellow-800 text-opacity-35 mb-3 sm:mb-4"
                    >
                        FLASH SALE
                    </p>

                    {/* Product Title */}
                    <h1 
                        className="text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-3 sm:mb-4 text-center"
                    >
                        Goldenia Engagement Ring
                    </h1>

                    {/* Product Description */}
                    <p 
                        className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 text-center"
                    >
                        Capture the essence of eternal love with our exquisite gold diamond engagement ring, a symbol of timeless commitment.
                    </p>

                    {/* Timer */}
                    <div 
                        className="flex items-center justify-center space-x-1 sm:space-x-2 mb-3 sm:mb-4"
                    >
                        <div className="text-center">
                            <div className="bg-white text-black rounded">
                                <span className="text-lg sm:text-xl md:text-2xl font-bold">01 :</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white text-black rounded">
                                <span className="text-lg sm:text-xl md:text-2xl font-bold">03 :</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white text-black rounded">
                                <span className="text-lg sm:text-xl md:text-2xl font-bold">45 :</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white text-black rounded">
                                <span className="text-lg sm:text-xl md:text-2xl font-bold">17</span>
                            </div>
                        </div>
                    </div>

                    {/* Timer Labels */}
                    <div 
                        className="flex items-center justify-center space-x-3 sm:space-x-4 md:space-x-5 mb-4 sm:mb-6"
                    >
                        <span className="text-xs text-gray-500">DAYS</span>
                        <span className="text-xs text-gray-500">HOURS</span>
                        <span className="text-xs text-gray-500">MINS</span>
                        <span className="text-xs text-gray-500">SECS</span>
                    </div>

                    {/* Add to Cart Button */}
                    <div 
                        className='flex items-center justify-center bg-yellow-800 bg-opacity-35 w-32 sm:w-36 md:w-40 mx-auto cursor-pointer hover:bg-opacity-60'
                    >
                        <button className="text-white px-3 py-2 font-semibold text-xs sm:text-sm md:text-base">
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashSale;