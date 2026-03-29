import React, { useEffect } from "react";
import { BsCurrencyRupee, BsX, BsHeart, BsBag } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useWishlist } from "../../Context/WishlistContext";
import { useCart } from "../../Context/CartContext";

const Wishlist = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleRemoveItem = (id, e) => {
    e.stopPropagation();
    removeFromWishlist(id);
    toast.success("Removed from wishlist");
  };

  const handleMoveToCart = async (item, e) => {
    e.stopPropagation();

    try {
      // Add item to cart first
      await addToCart(
        {
          id: item.id,
          title: item.title,
          price: item.price,
          originalPrice: item.originalPrice || item.price,
          image: item.image,
          description: item.description,
          discount: item.discount,
          rating: item.rating,
          inStock: item.inStock,
        },
        1,
      );

      // Remove from wishlist AFTER addToCart succeeds
      removeFromWishlist(item.id);

      toast.success("Moved to cart");
    } catch (error) {
      toast.error("Failed to move item to cart");
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
              My Wishlist
            </h1>
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-3">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"}
          </p>
          <div className="w-12 h-0.5 bg-[#C19A6B]"></div>
        </div>

        {/* Wishlist Grid */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer bg-white border border-gray-100 hover:border-[#C19A6B]/30 transition-colors"
                onClick={() => handleProductClick(item.id)}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={item.image}
                    alt={item.title}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x400?text=No+Image";
                    }}
                  />

                  {item.discount && (
                    <span className="absolute top-2 left-2 bg-[#C19A6B] text-white text-xs px-2 py-0.5 font-medium">
                      {item.discount}
                    </span>
                  )}

                  {!item.inStock && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 border border-gray-200">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemoveItem(item.id, e)}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-red-50 flex items-center justify-center rounded-full transition-colors"
                    title="Remove"
                  >
                    <BsX className="text-lg text-gray-500 hover:text-red-500" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3 md:p-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base font-semibold text-gray-900 flex items-center">
                      <BsCurrencyRupee className="text-xs" />
                      {item.price}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-gray-400 line-through flex items-center">
                        <BsCurrencyRupee className="text-[10px]" />
                        {item.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      if (item.inStock) handleMoveToCart(item, e);
                      else e.stopPropagation();
                    }}
                    disabled={!item.inStock}
                    className="w-full py-2 text-sm font-medium border border-[#C19A6B] text-[#C19A6B] hover:bg-[#C19A6B] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <BsBag className="text-xs" />
                    {item.inStock ? "Move to Cart" : "Unavailable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <BsHeart className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
              Save pieces you love and come back to them anytime.
            </p>
            <button
              onClick={() => navigate("/categories")}
              className="px-8 py-2.5 bg-[#C19A6B] text-white text-sm font-medium hover:bg-[#a8845a] transition-colors"
            >
              Browse Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
