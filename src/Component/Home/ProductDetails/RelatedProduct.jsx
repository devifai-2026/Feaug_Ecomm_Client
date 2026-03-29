import { useNavigate } from "react-router-dom";
import { BsCurrencyRupee, BsStarFill, BsHeart } from "react-icons/bs";

const RelatedProducts = ({ products = [] }) => {
  const navigate = useNavigate();

  if (!products || products.length === 0) return null;

  const handleProductClick = (product) => {
    navigate(`/product/${product.slug || product._id || product.id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-light text-gray-900 tracking-wide">
            You May Also Like
          </h2>
          <div className="w-12 h-[2px] bg-[#C19A6B] mt-2" />
        </div>
        <button
          onClick={() => navigate('/categories')}
          className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C19A6B] hover:text-[#A07A4B] transition-colors"
        >
          View All
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map((product) => {
          const id = product._id || product.id;
          const image = product.images?.[0]?.url || product.image;
          const name = product.name;
          const price = product.sellingPrice || product.offerPrice || product.basePrice || 0;
          const originalPrice = product.basePrice || product.originalPrice;
          const rating = product.ratingAverage || product.rating || 0;
          const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockQuantity === 0;
          const hasDiscount = originalPrice && originalPrice > price;

          return (
            <div
              key={id}
              className="group cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-[#F8F7F5] aspect-[3/4]">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Out of Stock */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white/90 text-gray-900 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                      Sold Out
                    </span>
                  </div>
                )}

                {/* Discount Badge */}
                {hasDiscount && !isOutOfStock && (
                  <div className="absolute top-3 left-3 bg-[#C19A6B] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                    {Math.round(((originalPrice - price) / originalPrice) * 100)}% Off
                  </div>
                )}

                {/* Wishlist + Quick View on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 bg-white/90 flex items-center justify-center hover:bg-white hover:text-[#C19A6B] transition-colors text-gray-600"
                  >
                    <BsHeart className="text-sm" />
                  </button>
                </div>

                {/* Quick Add */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product);
                    }}
                    className="w-full bg-white/95 text-gray-900 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C19A6B] hover:text-white transition-colors"
                  >
                    Quick View
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="mt-3 space-y-1.5">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#C19A6B] transition-colors truncate">
                  {name}
                </h3>

                {/* Rating */}
                {rating > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <BsStarFill
                          key={i}
                          className={`w-2.5 h-2.5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 ml-0.5">
                      {Number(rating).toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-gray-900 flex items-center">
                    <BsCurrencyRupee className="text-xs" />
                    {price.toLocaleString('en-IN')}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-gray-400 line-through flex items-center">
                      <BsCurrencyRupee className="text-[10px]" />
                      {originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
