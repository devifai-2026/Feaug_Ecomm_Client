import React from 'react';
import img from "../../../assets/RelatedProduct/freepik__make-a-jeweley-different-as-a-bold-statement-cuff-__6555.png"

const RelatedProducts = () => {
    return (
        <div className='max-w-[90%] mx-auto'>
            <div className='mt-10 mb-10'>
                <hr />
            </div>
            {/* Related Products Section */}
            <div>
                <h2 className='text-2xl md:text-3xl font-bold mb-8 md:mb-10 text-center md:text-left'>Related Products</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-3'>
                    {/* Product 1 */}
                    <div className='group cursor-pointer'>
                        <div className='relative overflow-hidden'>
                            <img 
                                className='w-full h-64 sm:h-80 md:h-[400px] object-cover transition-all duration-300 group-hover:scale-105' 
                                src={img} 
                                alt="Golden Pearls Bracelet" 
                            />
                        </div>
                        <h2 className='text-lg md:text-xl font-semibold mt-4 mb-2 transition-all duration-300 group-hover:scale-105'>Golden Pearls Bracelet</h2>
                        <div className='flex items-center gap-2'>
                            <p className='text-gray-500 line-through text-sm md:text-base transition-all duration-300 group-hover:scale-105'>$129.99</p>
                            <p className='text-lg md:text-xl font-bold text-gray-800 transition-all duration-300 group-hover:scale-105'>$89.99</p>
                        </div>
                    </div>
                    
                    {/* Product 2 */}
                    <div className='group cursor-pointer'>
                        <div className='relative overflow-hidden'>
                            <img 
                                className='w-full h-64 sm:h-80 md:h-[400px] object-cover transition-all duration-300 group-hover:scale-105' 
                                src={img} 
                                alt="Golden Pearls Bracelet" 
                            />
                        </div>
                        <h2 className='text-lg md:text-xl font-semibold mt-4 mb-2 transition-all duration-300 group-hover:scale-105'>Golden Pearls Bracelet</h2>
                        <div className='flex items-center gap-2'>
                            <p className='text-gray-500 line-through text-sm md:text-base transition-all duration-300 group-hover:scale-105'>$129.99</p>
                            <p className='text-lg md:text-xl font-bold text-gray-800 transition-all duration-300 group-hover:scale-105'>$89.99</p>
                        </div>
                    </div>
                    
                    {/* Product 3 */}
                    <div className='group cursor-pointer'>
                        <div className='relative overflow-hidden'>
                            <img 
                                className='w-full h-64 sm:h-80 md:h-[400px] object-cover transition-all duration-300 group-hover:scale-105' 
                                src={img} 
                                alt="Golden Pearls Bracelet" 
                            />
                        </div>
                        <h2 className='text-lg md:text-xl font-semibold mt-4 mb-2 transition-all duration-300 group-hover:scale-105'>Golden Pearls Bracelet</h2>
                        <div className='flex items-center gap-2'>
                            <p className='text-gray-500 line-through text-sm md:text-base transition-all duration-300 group-hover:scale-105'>$129.99</p>
                            <p className='text-lg md:text-xl font-bold text-gray-800 transition-all duration-300 group-hover:scale-105'>$89.99</p>
                        </div>
                    </div>
                </div>
            </div>
          
        </div>
    );
};

export default RelatedProducts;