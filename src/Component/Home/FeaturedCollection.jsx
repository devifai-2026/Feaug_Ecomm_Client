import { useState, useEffect } from "react";
import {
  BsArrowsAngleExpand,
  BsCurrencyRupee,
  BsHeart,
  BsHeartFill,
  BsX,
} from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";
import featuredApi from "../../apis/featuredApi";
import { transformProducts } from "../../helpers/transformers/productTransformer";

const FeaturedCollection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [products, setProducts] = useState([]);
  const [sectionTitle, setSectionTitle] = useState("Featured Collection");
  const [sectionActive, setSectionActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Fetch featured section config from admin API
  useEffect(() => {
    featuredApi.getFeaturedSection({
      setLoading,
      onSuccess: (data) => {
        const config = data.data?.featured;
        if (config && config.isActive && config.products?.length > 0) {
          setSectionActive(true);
          setSectionTitle(config.title || "Featured Collection");
          const transformedProducts = transformProducts(config.products);
          setProducts(transformedProducts);
        } else {
          setSectionActive(false);
          setProducts([]);
        }
      },
      onError: () => {
        setSectionActive(false);
        setProducts([]);
      },
    });
  }, []);

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();

    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
        discount: product.discount,
        rating: product.rating,
      },
      1,
    );

    toast.success('Added to cart!');
  };

  const handleWishlistClick = (product, e) => {
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.image,
        angleImage: product.angleImage,
        discount: product.discount,
        description: product.description,
        rating: product.rating,
        inStock: product.inStock,
      });

      toast.success('Added to wishlist');
    }
  };



  const handleViewWishlist = () => {
    navigate("/wishlist");
  };

  const handleViewMore = () => {
    navigate("/categories");
  };

  const handleFullScreen = (image, e) => {
    e.stopPropagation();
    setSelectedImage(image);
  };

  // Don't render if admin hasn't enabled the section
  if (!sectionActive || products.length === 0) return null;

  return (
    <div className="mt-16 max-w-[90%] mx-auto">
      {/* ... styles ... */}
      <style>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeDown {
                    from {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes zoomIn {
                    from {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                .animate-slideInRight {
                    animation: slideInRight 0.3s ease-out;
                }
                
                .animate-fadeDown {
                    animation: fadeDown 0.5s ease-out;
                }
                
                .animate-fadeUp {
                    animation: fadeUp 0.5s ease-out;
                }
                
                .animate-zoomIn {
                    animation: zoomIn 0.5s ease-out;
                }
            `}</style>
      {/* ... header ... */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 animate-fadeDown">
          {sectionTitle}
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleViewMore}
            className="text-nowrap flex items-center gap-2 cursor-pointer hover:gap-3 transition-all duration-300 animate-fadeDown group text-gray-600 hover:text-gray-900"
          >
            View More
            <FaArrowRightLong className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product, index) => {
          const isInWishlistItem = isInWishlist(product.id);

          return (
            <div
              key={product.id}
              className="relative overflow-hidden group cursor-pointer bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 animate-fadeUp"
              style={{ animationDelay: `${(index % 4) * 0.1 + 0.2}s` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(product.id)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                {/* Main Image */}
                <img
                  className={`w-full h-72 object-cover transition-opacity duration-500 ${hoveredCard === index ? "opacity-0" : "opacity-100"
                    }`}
                  src={product.image}
                  alt={product.title}
                />

                {/* Angle Image - Shows on hover */}
                <img
                  className={`absolute top-0 left-0 w-full h-72 object-cover transition-opacity duration-500 ${hoveredCard === index ? "opacity-100" : "opacity-0"
                    }`}
                  src={product.angleImage}
                  alt={`${product.title} - alternate angle`}
                />

                {/* Out of Stock Overlay */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                    <div className="bg-white/90 text-gray-900 px-4 py-2 font-bold uppercase tracking-widest text-sm shadow-xl">
                      Out of Stock
                    </div>
                  </div>
                )}
                {/* Discount Badge - Top Left */}
                {product.discount && (
                  <div
                    className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 text-sm font-bold z-10 animate-zoomIn"
                    style={{ animationDelay: "0.5s" }}
                  >
                    {product.discount}
                  </div>
                )}

                {/* Hover Icons */}
                {/* Mobile & Tablet: Always visible */}
                <div className="lg:hidden absolute top-3 right-3 flex flex-col gap-2 z-10">
                  <button
                    className={`p-2 shadow-lg transition-all duration-300 hover:scale-110 ${isInWishlistItem
                        ? "bg-red-50 text-red-500"
                        : "bg-white text-gray-700 rounded-full hover:bg-red-50 hover:text-red-500"
                      }`}
                    onClick={(e) => handleWishlistClick(product, e)}
                    title={
                      isInWishlistItem
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    {isInWishlistItem ? (
                      <BsHeartFill className="text-lg" />
                    ) : (
                      <BsHeart className="text-lg" />
                    )}
                  </button>

                  <button
                    className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors hover:scale-110"
                    onClick={(e) => handleFullScreen(product.image, e)}
                  >
                    <BsArrowsAngleExpand className="text-gray-700" />
                  </button>
                </div>

                {/* Desktop: Show on hover */}
                <div
                  className={`hidden lg:flex absolute top-3 right-3 flex-col gap-2 transition-all duration-300 z-10 ${hoveredCard === index
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-4"
                    }`}
                >
                  <button
                    className={`p-2 shadow-lg transition-all duration-300 hover:scale-110 ${isInWishlistItem
                        ? "bg-red-50 text-red-500"
                        : "bg-white text-gray-700 rounded-full hover:bg-red-50 hover:text-red-500"
                      }`}
                    onClick={(e) => handleWishlistClick(product, e)}
                    title={
                      isInWishlistItem
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    {isInWishlistItem ? (
                      <BsHeartFill className="text-lg" />
                    ) : (
                      <BsHeart className="text-lg" />
                    )}
                  </button>

                  <button
                    className="bg-white p-2 shadow-lg rounded-full hover:bg-gray-100 transition-colors hover:scale-110"
                    onClick={(e) => handleFullScreen(product.image, e)}
                  >
                    <BsArrowsAngleExpand className="text-gray-700" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                {/* Mobile & Tablet: Always visible */}
                {product.inStock && (
                  <>
                    <button
                      disabled={!product.inStock}
                      className={`lg:hidden absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-600 py-2 px-6 transition-all duration-300 w-[90%] hover:scale-105 uppercase tracking-wide text-sm text-nowrap z-10 font-semibold shadow-md hover:bg-gray-50 border border-gray-200 ${!product.inStock ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>

                    {/* Desktop: Show on hover */}
                    <button
                      disabled={!product.inStock}
                      className={`hidden lg:block absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-600 py-2 px-6 transition-all duration-300 w-[90%] hover:scale-105 uppercase tracking-widest z-10 font-semibold shadow-md hover:bg-gray-50 border border-gray-200 ${hoveredCard === index
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                        } ${!product.inStock ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </>
                )}
              </div>

              {/* Product Info */}
              <div className="mt-3 p-4 border-t border-gray-100">
                <h2
                  className="text-lg font-semibold mb-1 group-hover:text-gray-900 transition-colors animate-fadeUp line-clamp-1"
                  style={{ animationDelay: "0.3s" }}
                >
                  {product.title}
                </h2>
                <div className="flex items-center justify-between">
                  <p
                    className="flex items-center gap-1 text-gray-500 font-medium text-lg animate-fadeUp"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <BsCurrencyRupee />
                    {product.price}
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          <BsCurrencyRupee className="inline" />
                          {product.originalPrice}
                        </span>
                      )}
                  </p>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-4xl hover:scale-110 transition-transform z-[110]"
            onClick={() => setSelectedImage(null)}
          >
            <BsX />
          </button>

          <div className="relative max-w-[90vw] max-h-[90vh] animate-zoomIn">
            <img
              src={selectedImage}
              alt="Full screen view"
              className="w-full h-full object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FeaturedCollection;
