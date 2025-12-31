import { BsCurrencyRupee } from 'react-icons/bs';
import one from "../../../assets/RelatedProduct/one.jpg"
import two from "../../../assets/RelatedProduct/two.jpg"
import three from "../../../assets/RelatedProduct/three.jpg"

const RelatedProducts = () => {
    const products = [
        {
            id: 1,
            name: "Platinum Square Ring",
            originalPrice: 129.99,
            discountedPrice: 89.99,
            image: one
        },
        {
            id: 2,
            name: "Platinum Rectangular Ring",
            originalPrice: 149.99,
            discountedPrice: 99.99,
            image: two
        },
        {
            id: 3,
            name: "Platinum Oval Ring",
            originalPrice: 109.99,
            discountedPrice: 79.99,
            image: three
        }
    ];

    return (
        <div className='max-w-[90%] mx-auto'>
            <div className='mt-10 mb-10'>
                <hr />
            </div>
            {/* Related Products Section */}
            <div>
                <h2 className='text-2xl md:text-3xl font-bold mb-8 md:mb-10 text-center md:text-left'>Related Products</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
                    {products.map((product) => (
                        <div key={product.id} className='group cursor-pointer'>
                            <div className='relative overflow-hidden'>
                                <img 
                                    className='w-full h-64 sm:h-80 md:h-[400px] object-cover transition-all duration-300 group-hover:scale-105' 
                                    src={product.image} 
                                    alt={product.name} 
                                />
                            </div>
                            <h2 className='text-lg md:text-xl font-semibold mt-4 mb-2 transition-all duration-300 group-hover:scale-105'>{product.name}</h2>
                            <div className='flex items-center gap-2'>
                                <p className='text-gray-500 line-through text-sm md:text-base transition-all duration-300 group-hover:scale-105 flex items-center gap-1'>
                                    <BsCurrencyRupee />{product.originalPrice}
                                </p>
                                <p className='text-lg md:text-xl font-bold text-gray-800 transition-all duration-300 group-hover:scale-105 flex items-center gap-1'>
                                    <BsCurrencyRupee />{product.discountedPrice}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RelatedProducts;