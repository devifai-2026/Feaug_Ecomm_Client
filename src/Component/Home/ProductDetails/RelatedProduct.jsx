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
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
                    {/* Product 1 */}
                    <div className=''>
                        <img 
                            className='w-full h-64 sm:h-80 md:h-[400px] object-cover rounded-lg' 
                            src={img} 
                            alt="Golden Pearls Bracelet" 
                        />
                        <h2 className='text-lg md:text-xl font-semibold mt-4 mb-2'>Golden Pearls Bracelet</h2>
                        <div className='flex items-center r gap-2'>
                            <p className='text-gray-500 line-through text-sm md:text-base'>$129.99</p>
                            <p className='text-lg md:text-xl font-bold text-gray-800'>$89.99</p>
                        </div>
                    </div>
                    
                    {/* Product 2 */}
                    <div className=''>
                        <img 
                            className='w-full h-64 sm:h-80 md:h-[400px] object-cover rounded-lg' 
                            src={img} 
                            alt="Golden Pearls Bracelet" 
                        />
                        <h2 className='text-lg md:text-xl font-semibold mt-4 mb-2'>Golden Pearls Bracelet</h2>
                        <div className='flex items-center  gap-2'>
                            <p className='text-gray-500 line-through text-sm md:text-base'>$129.99</p>
                            <p className='text-lg md:text-xl font-bold text-gray-800'>$89.99</p>
                        </div>
                    </div>
                    
                    {/* Product 3 */}
                    <div className=''>
                        <img 
                            className='w-full h-64 sm:h-80 md:h-[400px] object-cover rounded-lg' 
                            src={img} 
                            alt="Golden Pearls Bracelet" 
                        />
                        <h2 className='text-lg md:text-xl font-semibold mt-4 mb-2'>Golden Pearls Bracelet</h2>
                        <div className='flex items-center  gap-2'>
                            <p className='text-gray-500 line-through text-sm md:text-base'>$129.99</p>
                            <p className='text-lg md:text-xl font-bold text-gray-800'>$89.99</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-10 mb-10'>
                <hr />
            </div>
        </div>
    );
};

export default RelatedProducts;