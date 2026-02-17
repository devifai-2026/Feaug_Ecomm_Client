import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sale from "../../assets/BestSeller/left.jpeg";
import {
  BsHeart,
  BsShare,
  BsArrowsAngleExpand,
  BsCurrencyRupee,
  BsHeartFill,
} from "react-icons/bs";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";
import productApi from "../../apis/productApi";
import { transformProducts } from "../../helpers/transformers/productTransformer";

const BestSeller = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch best seller products from API
  useEffect(() => {
    const fetchBestSellers = async () => {
      setLoading(true);
      setError(null);

      await productApi.getBestSellers({
        params: { limit: 10 },
        setLoading,
        onSuccess: (data) => {
          if (data.status === "success" && data.data?.products?.length > 0) {
            // Transform API products to match component format
            const transformedProducts = transformProducts(data.data.products);
            setProducts(transformedProducts);
          } else {
            setProducts([]);
            setError("No best sellers available at the moment");
          }
        },
        onError: (err) => {
          console.error("Error fetching best sellers:", err);
          setError("Failed to load best sellers. Please try again later.");
          setProducts([]);
        },
      });
    };

    fetchBestSellers();
  }, []);

  const slidesPerPage = 3;
  const totalSlides = Math.ceil(products.length / slidesPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleProducts = products.slice(
    currentSlide * slidesPerPage,
    (currentSlide + 1) * slidesPerPage,
  );

  // Handle card click to navigate to details page
  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Handle expand icon click (Open Image Preview)
  const handleExpandClick = (product, e) => {
    e.stopPropagation(); // Prevent card click from triggering
    setSelectedImage(product.image);
  };

  // Handle Share
  const handleShare = (product, e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/product/${product.id}`;

    if (navigator.share) {
      navigator
        .share({
          title: product.title,
          text: `Check out this beautiful ${product.title} at Feauage Jewelry!`,
          url: shareUrl,
        })
        .catch((err) => console.log("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Product link copied to clipboard!");
    }
  };

  // Handle Add to Cart
  const handleAddToCart = (product, e) => {
    e.stopPropagation();

    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
        rating: product.rating,
      },
      1,
    );

    toast.success(
      <div>
        <p className="font-semibold">Added to cart!</p>
        <p className="text-sm">{product.title}</p>
      </div>,
      {
        icon: "🛒",
        duration: 3000,
        style: {
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
        },
      },
    );
  };

  // Handle Wishlist Click
  const handleWishlistClick = (product, e) => {
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.custom(
        (t) => (
          <div className="animate-slideInRight max-w-md w-full bg-white shadow-lg flex border border-gray-200">
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <BsHeartFill className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Removed from wishlist
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.title} has been removed
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/wishlist");
                }}
                className="w-full border border-transparent p-4 flex items-center justify-center text-sm font-medium text-pink-600 hover:text-pink-500 transition-colors"
              >
                View Wishlist
              </button>
            </div>
          </div>
        ),
        {
          duration: 4000,
        },
      );
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.image,
        angleImage: product.angleImage,
        description: product.description,
        rating: product.rating,
        inStock: true,
      });

      toast.success(
        <div>
          <p className="font-semibold">Added to wishlist!</p>
          <p className="text-sm">{product.title}</p>
        </div>,
        {
          icon: "❤️",
          duration: 3000,
          style: {
            background: "#fff5f5",
            border: "1px solid #fca5a5",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      );
    }
  };

  // Handle view wishlist
  const handleViewWishlist = () => {
    navigate("/wishlist");
  };

  // Handle view more
  const handleViewMore = () => {
    navigate("/categories");
  };

  // Refresh AOS when slide changes
  useEffect(() => {
    AOS.refresh();
  }, [currentSlide]);

  return (
    <div className="mt-16 max-w-[90%] mx-auto overflow-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            border: "1px solid #e5e7eb",
          },
        }}
      />

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
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>

      <div className="mb-10">
        <hr />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-2">
        {/* Seasonal Sale */}
        <div className="w-full lg:w-1/3">
          <div className="relative">
            <img
              className="w-full h-[500px] object-cover"
              src={sale}
              alt="Seasonal Sale"
              data-aos="fade-right"
              data-aos-delay="200"
            />
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white text-center space-y-4">
              <p className="text-lg font-semibold">SALE</p>
              <p className="text-2xl font-bold">15%</p>
              <p className="text-xl font-bold">Seasonal Sale</p>
              <button
                onClick={handleViewMore}
                className="border border-white px-6 py-2 hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
              >
                SHOP NOW
              </button>
            </div>
          </div>
        </div>

        {/* Best Seller */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div data-aos="fade-down" data-aos-delay="300">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
                Best Seller
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Take a look at our best selling products that we have <br />{" "}
                provided for your beauty and jewelry needs.
              </p>
            </div>

            <div className="flex items-center gap-6 mt-4 sm:mt-0">
              {/* View Wishlist Button */}
              <button
                onClick={handleViewWishlist}
                className="text-nowrap flex items-center gap-2 cursor-pointer hover:gap-3 transition-all duration-300 text-gray-600 hover:text-gray-900 group hidden sm:flex"
                data-aos="fade-down"
                data-aos-delay="400"
              >
                <BsHeart className="text-lg group-hover:scale-110 transition-transform" />
                View Wishlist
                <FaArrowRightLong className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Slider Pagination */}
              <div
                className="flex items-center gap-4"
                data-aos="fade-down"
                data-aos-delay="400"
              >
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-gray-100 rounded-full"
                >
                  <MdKeyboardArrowLeft className="text-xl" />
                </button>
                <span className="text-sm font-medium">
                  {currentSlide + 1}/{totalSlides}
                </span>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-gray-100 rounded-full"
                >
                  <MdKeyboardArrowRight className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {visibleProducts.map((product, index) => {
              const isInWishlistItem = isInWishlist(product.id);

              return (
                <div
                  key={product.id}
                  className="relative overflow-hidden group cursor-pointer"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleCardClick(product.id)}
                  data-aos="fade-up"
                  data-aos-delay={index * 100 + 500}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gray-100">
                    {/* Main Image */}
                    <img
                      className={`w-full h-80 object-cover transition-opacity duration-500 ${
                        hoveredCard === index ? "opacity-0" : "opacity-100"
                      }`}
                      src={product.image}
                      alt={product.title}
                    />

                    {/* Angle Image - Shows on hover */}
                    <img
                      className={`absolute top-0 left-0 w-full h-80 object-cover transition-opacity duration-500 ${
                        hoveredCard === index ? "opacity-100" : "opacity-0"
                      }`}
                      src={product.angleImage}
                      alt={`${product.title} - alternate angle`}
                    />

                    {/* Hover Icons - Mobile & Tablet: Always visible */}
                    <div className="lg:hidden absolute top-3 right-3 flex flex-col gap-2 z-10">
                      <button
                        className={`p-2 rounded-full shadow-lg transition-all duration-300 ${
                          isInWishlistItem
                            ? "bg-red-50 text-red-500"
                            : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-500"
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
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        onClick={(e) => handleShare(product, e)}
                      >
                        <BsShare className="text-gray-700 hover:text-blue-500" />
                      </button>
                      <button
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        onClick={(e) => handleExpandClick(product, e)}
                      >
                        <BsArrowsAngleExpand className="text-gray-700" />
                      </button>
                    </div>

                    {/* Hover Icons - Desktop: Show on hover */}
                    <div
                      className={`hidden lg:flex absolute top-3 right-3 flex-col gap-2 transition-all duration-300 z-10 ${
                        hoveredCard === index
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-4"
                      }`}
                    >
                      <button
                        className={`p-2 rounded-full shadow-lg transition-all duration-300 ${
                          isInWishlistItem
                            ? "bg-red-50 text-red-500"
                            : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-500"
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
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        onClick={(e) => handleShare(product, e)}
                      >
                        <BsShare className="text-gray-700 hover:text-blue-500" />
                      </button>
                      <button
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        onClick={(e) => handleExpandClick(product, e)}
                      >
                        <BsArrowsAngleExpand className="text-gray-700" />
                      </button>
                    </div>

                    {/* Add to Cart Button - Mobile & Tablet: Always visible */}
                    <button
                      className="lg:hidden absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-black w-[90%] py-3 px-3 text-sm font-medium transition-all duration-300 text-nowrap hover:scale-105 tracking-widest z-10"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      ADD TO CART
                    </button>

                    {/* Add to Cart Button - Desktop: Show on hover */}
                    <button
                      className={`hidden lg:block absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-black w-[90%] py-3 px-3 text-sm font-medium transition-all duration-300 text-nowrap hover:scale-105 tracking-widest z-10 ${
                        hoveredCard === index
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      ADD TO CART
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="mt-4">
                    <h3
                      className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                        hoveredCard === index
                          ? "text-orange-800"
                          : "text-gray-900"
                      }`}
                    >
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {product.originalPrice ? (
                        <>
                          <span className="text-gray-600 font-bold flex items-center gap-1">
                            <BsCurrencyRupee />
                            {product.price}
                          </span>
                          <span className="text-gray-400 line-through text-sm flex items-center gap-1">
                            <BsCurrencyRupee />
                            {product.originalPrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-600 font-bold flex items-center gap-1">
                          <BsCurrencyRupee />
                          {product.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <hr />
      </div>

      {/* Image Modal for Expand Button */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimes />
            </button>
            <img
              src={selectedImage}
              alt="Product Preview"
              className="max-w-full max-h-[85vh] object-contain shadow-2xl animate-in zoom-in-95 duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BestSeller;
