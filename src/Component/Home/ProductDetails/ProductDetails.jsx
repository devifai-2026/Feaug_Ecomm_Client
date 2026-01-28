import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  BsArrowLeft,
  BsHeart,
  BsShare,
  BsStarFill,
  BsChevronLeft,
  BsChevronRight,
  BsEye,
  BsEyeFill,
  BsCurrencyRupee,
  BsHeartFill
} from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";
import RelatedProducts from "./RelatedProduct";
import BigImg from "../../../assets/ProductDetails/DetailsMainImg.webp";
import sone from "../../../assets/ProductDetails/sone.webp";
import stwo from "../../../assets/ProductDetails/stwo.webp";
import sthree from "../../../assets/ProductDetails/sthree.webp";
import sfour from "../../../assets/ProductDetails/sfour.webp";
import { useWishlist } from "../../Context/WishlistContext";
import { useCart } from "../../Context/CartContext";



const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("DESCRIPTION");
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [viewCount, setViewCount] = useState(40);
  const [isEyeOpen, setIsEyeOpen] = useState(true);
  const thumbnailContainerRef = useRef(null);
  const imgRef = useRef(null);

  // Use contexts
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const product = {
    id: id,
    title: "Diamond Necklace",
    subtitle: "River Luxe Collection",
    price: 299.99,
    originalPrice: 399.99,
    description: "This exquisite diamond necklace features brilliant cut diamonds set in premium 18k gold. Perfect for special occasions and everyday elegance.",
    image: BigImg,
    images: [BigImg, sone, stwo, sthree, sfour, stwo, sthree],
    rating: 4.5,
    reviews: 64,
    productNumber: "PN-12345",
    category: "Necklaces",
    tags: ["Diamond", "Gold", "Luxury", "Elegant"],
    delivery: "check your location",
  };

  const isProductInWishlist = isInWishlist(product.id);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-scroll thumbnails to selected image
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const thumbnailWidth = 80;
      const container = thumbnailContainerRef.current;
      const scrollPosition = selectedImageIndex * thumbnailWidth;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [selectedImageIndex]);

  // View count and eye animation effects
  useEffect(() => {
    // View count increment interval
    const viewCountInterval = setInterval(() => {
      setViewCount((prev) => {
        const increment = Math.floor(Math.random() * 50) + 30; // 30-80 increment
        const newCount = prev + increment;
        return newCount > 850 ? 40 : newCount; // Reset if exceeds 850
      });
    }, 30000); // Every 30 seconds

    // Eye blink interval
    const eyeInterval = setInterval(() => {
      setIsEyeOpen(false);
      setTimeout(() => setIsEyeOpen(true), 200); // Close for 200ms then open
    }, 3000); // Blink every 3 seconds

    return () => {
      clearInterval(viewCountInterval);
      clearInterval(eyeInterval);
    };
  }, []);

  // Add to Cart Functionality
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      description: product.description,
      rating: product.rating,
      category: product.category
    }, quantity);

    toast.success(
      <div>
        <p className="font-semibold">Added to cart!</p>
        <p className="text-sm">{product.title} (x{quantity})</p>
      </div>,
      {
        icon: '🛒',
        duration: 3000,
        style: {
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
        },
      }
    );
  };

  // Wishlist Functionality
  const handleWishlistClick = () => {
    if (isProductInWishlist) {
      removeFromWishlist(product.id);
      toast.custom((t) => (
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
                navigate('/wishlist');
              }}
              className="w-full border border-transparent p-4 flex items-center justify-center text-sm font-medium text-pink-600 hover:text-pink-500 transition-colors"
            >
              View Wishlist
            </button>
          </div>
        </div>
      ), {
        duration: 4000,
      });
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        description: product.description,
        rating: product.rating,
        category: product.category,
        inStock: true
      });

      toast.success(
        <div>
          <p className="font-semibold">Added to wishlist!</p>
          <p className="text-sm">{product.title}</p>
        </div>,
        {
          icon: '❤️',
          duration: 3000,
          style: {
            background: '#fff5f5',
            border: '1px solid #fca5a5',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        }
      );
    }
  };

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <BsStarFill
          key={i}
          className={`text-sm ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
        />
      );
    }
    return stars;
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const scrollThumbnails = (direction) => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 100;
      thumbnailContainerRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "DESCRIPTION":
        return (
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed">
              Introducing our exquisite Rhea Gold Earrings from the River Luxe Collection. These earrings are the epitome of sophistication and grace, designed to make a statement on any occasion. Crafted with meticulous attention to detail, they showcase the timeless beauty of diamonds in a breathtaking drop design.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              The diamonds, carefully selected for their exceptional quality, radiate brilliance and sparkle with every movement. Set in lustrous 18K pure gold, these earrings exude a luxurious and refined aura. The white gold complements the diamonds beautifully, enhancing its natural luminosity and creating a harmonious combination of elegance and glamour. Come with secure lever-back closures, providing both a secure fit and ease of wearing. The lightweight design ensures that you can enjoy wearing these earrings for extended periods without any discomfort.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Whether you're attending a formal event, celebrating a special occasion, or simply want to elevate your everyday style, these Diamond Drop Earrings are the perfect choice. They effortlessly add a touch of sophistication and glamour to any ensemble, making them a versatile and timeless accessory.
            </p>
          </div>
        );
      case "DETAILS":
        return (
          <div className="text-gray-600 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Product Specifications</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-sm md:text-base">Material:</span>
                    <span className="text-xs md:text-sm">18K Pure Gold</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm md:text-base">Diamond Quality:</span>
                    <span className="text-xs md:text-sm">VS1-SI1</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm md:text-base">Diamond Color:</span>
                    <span className="text-xs md:text-sm">G-H</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm md:text-base">Closure Type:</span>
                    <span className="text-xs md:text-sm">Lever-back</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dimensions</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-sm md:text-base">Length:</span>
                    <span className="text-xs md:text-sm">2.5 inches</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm md:text-base">Width:</span>
                    <span className="text-xs md:text-sm">0.5 inches</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm md:text-base">Weight:</span>
                    <span className="text-xs md:text-sm">3.2 grams</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "SIZING GUIDE":
        return (
          <div className="text-gray-600 space-y-4">
            <h3 className="font-semibold text-lg">Earring Sizing Guide</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium">Small (1-1.5 inches)</h4>
                <p className="text-sm">Perfect for everyday wear and subtle elegance</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium">Medium (1.5-2.5 inches)</h4>
                <p className="text-sm">Ideal for special occasions and evening events</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium">Large (2.5+ inches)</h4>
                <p className="text-sm">Make a bold statement for formal events</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Care Instructions</h4>
              <ul className="text-sm space-y-1">
                <li>• Store in original box or soft pouch</li>
                <li>• Avoid contact with water and chemicals</li>
                <li>• Clean with soft cloth regularly</li>
                <li>• Remove before swimming or showering</li>
              </ul>
            </div>
          </div>
        );
      case "REVIEWS":
        return (
          <div className="text-gray-600 space-y-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">4.8</div>
                <div className="flex items-center gap-1">{renderStars(4.8)}</div>
                <div className="text-sm text-gray-500">64 reviews</div>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm w-4">{star}</span>
                    <BsStarFill className="text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${star === 5 ? "80%" : star === 4 ? "15%" : star === 3 ? "5%" : "0%"
                            }`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm w-8">
                      {star === 5 ? "80%" : star === 4 ? "15%" : star === 3 ? "5%" : "0%"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <div className="flex items-center gap-1">{renderStars(5)}</div>
                  </div>
                  <span className="text-sm text-gray-500">2 weeks ago</span>
                </div>
                <p>Absolutely stunning! The craftsmanship is exceptional and they're so comfortable to wear all day.</p>
              </div>
              <div className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">Michael Chen</h4>
                    <div className="flex items-center gap-1">{renderStars(4)}</div>
                  </div>
                  <span className="text-sm text-gray-500">1 month ago</span>
                </div>
                <p>Beautiful earrings, perfect for my wife's birthday. The gold quality is excellent.</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            border: '1px solid #e5e7eb',
          },
        }}
      />

      <style jsx>{`
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
      `}</style>

      <div className="max-w-[90%] mx-auto py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-105 mb-6"
        >
          <BsArrowLeft className="text-lg transition-transform duration-300 group-hover:scale-110" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Product Images Section */}
          <div className="space-y-4">
            {/* Main Product Image with Zoom */}
            <div
              className="flex justify-center mx-auto mb-6 relative group cursor-crosshair"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
            >
              {/* Main Product Image */}
              <img
                ref={imgRef}
                src={product.images[selectedImageIndex]}
                alt={product.title}
                className="w-full max-w-lg h-auto max-h-[500px] object-contain transition-transform duration-300 hover:scale-105"
              />

              {/* Blue mesh overlay (desktop only) */}
              {isHovering && (
                <div
                  className="hidden md:block absolute pointer-events-none border border-blue-500 rounded-sm"
                  style={{
                    width: "150px",
                    height: "150px",
                    left: `calc(${zoomPos.x}% - 50px)`,
                    top: `calc(${zoomPos.y}% - 50px)`,
                    backgroundImage: `
                      linear-gradient(to right, rgba(59,130,246,0.3) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(59,130,246,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: "8px 8px",
                    backgroundColor: "rgba(59,130,246,0.1)",
                    boxShadow: "0 0 8px rgba(59,130,246,0.4)",
                    zIndex: 10,
                  }}
                ></div>
              )}

              {/* Zoomed Image (desktop only) */}
              {isHovering && (
                <div className="hidden md:block absolute top-1/2 left-[100%] -translate-y-1/2 w-[610px] h-[500px] border border-gray-200 overflow-hidden z-10 bg-white shadow-lg rounded-md">
                  <img
                    src={product.images[selectedImageIndex]}
                    alt="Zoomed"
                    className="absolute object-contain transition-transform duration-100 pt-14"
                    style={{
                      transform: `translate(-${zoomPos.x}%, -${zoomPos.y}%) scale(1.7)`,
                      transformOrigin: "top left",
                    }}
                  />
                </div>
              )}

              {/* Navigation Arrows for Main Image */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              >
                <BsChevronLeft className="text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              >
                <BsChevronRight className="text-gray-700" />
              </button>
            </div>

            {/* Thumbnail Images with Scroll */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 w-full max-w-2xl">
                <button
                  onClick={() => scrollThumbnails("left")}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 hover:scale-110 flex-shrink-0"
                >
                  <BsChevronLeft className="text-gray-600" />
                </button>

                <div
                  ref={thumbnailContainerRef}
                  className="flex gap-2 overflow-x-auto flex-1 justify-start px-2 scrollbar-hide"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    minHeight: "84px",
                  }}
                >
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 cursor-pointer border-2 transition-all duration-300 ${selectedImageIndex === index
                          ? "border-orange-500 shadow-md"
                          : "border-transparent hover:border-gray-300"
                        }`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-16 h-16 md:w-20 md:h-20 object-cover transition-all duration-300 hover:scale-110"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scrollThumbnails("right")}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 hover:scale-110 flex-shrink-0"
                >
                  <BsChevronRight className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Top Section - Breadcrumbs to Description */}
            <div className="space-y-6">
              {/* Breadcrumbs */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Link
                  to="/"
                  className="cursor-pointer hover:text-gray-700 transition-all duration-300 hover:scale-105"
                >
                  Home
                </Link>
                <span className="text-gray-400">|</span>
                <span className="cursor-pointer hover:text-gray-700 transition-all duration-300 hover:scale-105">
                  Products
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-800 font-medium transition-all duration-300 hover:scale-105">
                  Details
                </span>
              </div>

              <p className="text-yellow-700 uppercase transition-all duration-300 hover:scale-105 cursor-default">
                {product.subtitle}
              </p>
              <h1 className="text-3xl font-bold text-gray-800 transition-all duration-300 hover:scale-105 cursor-default">
                {product.title}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-semibold text-gray-700 flex items-center gap-1 transition-all duration-300 hover:scale-105 cursor-default">
                    <BsCurrencyRupee className="transition-transform duration-300 group-hover:scale-110" />
                    {product.price}
                  </p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-lg text-gray-500 line-through flex items-center gap-1">
                      <BsCurrencyRupee />
                      {product.originalPrice}
                    </p>
                  )}
                </div>
                <span className="text-green-600 font-medium transition-all duration-300 hover:scale-105 cursor-default">
                  In Stock
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed transition-all duration-300 hover:scale-105 cursor-default">
                {product.description}
              </p>

              {/* Rating and Reviews with Wishlist */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-default">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-gray-600 text-sm">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Wishlist Button */}
                  <button
                    className={`p-2 hover:bg-gray-50 transition-all duration-300 hover:scale-110 ${isProductInWishlist ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                      }`}
                    onClick={handleWishlistClick}
                    title={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {isProductInWishlist ? (
                      <BsHeartFill className="text-xl transition-transform duration-300" />
                    ) : (
                      <BsHeart className="text-xl transition-transform duration-300" />
                    )}
                  </button>
                  <button
                    className="p-2 hover:bg-gray-50 transition-all duration-300 hover:scale-110"
                    title="Share product"
                  >
                    <BsShare className="text-xl text-gray-600 hover:text-blue-500 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section - Quantity to Add to Cart */}
            <div className="space-y-6">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium transition-all duration-300 hover:scale-105">
                  Quantity:
                </span>
                <div className="flex items-center transition-all duration-300 hover:scale-105">
                  <button
                    onClick={decreaseQuantity}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-all duration-300 hover:scale-110 font-bold"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-bold transition-all duration-300 hover:scale-105">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-all duration-300 hover:scale-110 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex gap-4">
                <button
                  className="flex-1 bg-black text-white py-3 px-6 hover:bg-gray-800 transition-all duration-300 hover:scale-105 font-semibold"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>

              {/* Additional Product Information */}
              <div className="border-t pt-4 space-y-1">
                <div className="flex justify-between py-1 group cursor-pointer">
                  <span className="text-gray-600 transition-all duration-300 group-hover:scale-105">
                    Product Number:
                  </span>
                  <span className="font-medium transition-all duration-300 group-hover:scale-105">
                    {product.productNumber}
                  </span>
                </div>
                <div className="flex justify-between py-1 group cursor-pointer">
                  <span className="text-gray-600 transition-all duration-300 group-hover:scale-105">
                    Category:
                  </span>
                  <span className="font-medium transition-all duration-300 group-hover:scale-105">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between py-1 group cursor-pointer">
                  <span className="text-gray-600 transition-all duration-300 group-hover:scale-105">
                    Tags:
                  </span>
                  <span className="font-medium transition-all duration-300 group-hover:scale-105">
                    {product.tags.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between py-1 group cursor-pointer">
                  <span className="text-gray-600 transition-all duration-300 group-hover:scale-105">
                    Delivery:
                  </span>
                  <span className="font-medium text-gray-600 underline transition-all duration-300 group-hover:scale-105">
                    {product.delivery}
                  </span>
                </div>
              </div>
              <div className="mt-12 mb-8">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    {isEyeOpen ? (
                      <BsEyeFill className="text-2xl text-blue-600 animate-pulse" />
                    ) : (
                      <BsEye className="text-2xl text-blue-600" />
                    )}
                    <span className="text-lg font-semibold text-gray-700">
                      Currently Viewing This Product:{" "}
                      <span className="text-blue-600 font-bold text-xl">
                        {viewCount}
                      </span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    People are actively viewing this product right now
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Details Tabs - Vertical Layout */}
        <div className="mt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Vertical Tabs Navigation */}
            <div className="lg:w-1/4">
              <div className="space-y-1 border-r border-gray-200 pr-4">
                {["DESCRIPTION", "DETAILS", "SIZING GUIDE", "REVIEWS"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-40 lg:w-full text-center lg:text-left py-3 px-4 font-medium transition-all duration-300 hover:scale-105 ${activeTab === tab
                          ? "bg-black text-white"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div className="lg:w-3/4 py-2">{renderTabContent()}</div>
          </div>
        </div>
      </div>

      <RelatedProducts />
    </div>
  );
};

export default ProductDetails;