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
  BsHeartFill,
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

import productApi from "../../../apis/productApi";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useCart();

  const isProductInCart = product ? isInCart(product._id) : false;
  const cartQuantity = product ? getItemQuantity(product._id) : 0;

  // Sync local quantity with cart if it's there
  useEffect(() => {
    if (isProductInCart && cartQuantity > 0) {
      setQuantity(cartQuantity);
    }
  }, [isProductInCart, cartQuantity]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        await productApi.getProduct({
          productId: id,
          onSuccess: (response) => {
            if (response.status === "success") {
              setProduct(response.data.product);
              setRelatedProducts(response.data.relatedProducts || []);
            }
          },
          onError: (err) => {
            setError(err.message || "Failed to fetch product");
            toast.error("Failed to load product details");
          },
        });
      } catch (err) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const isProductInWishlist = product ? isInWishlist(product._id) : false;

  // View count and eye animation effects
  useEffect(() => {
    if (!product) return;

    // View count increment interval
    const viewCountInterval = setInterval(() => {
      setViewCount((prev) => {
        const increment = Math.floor(Math.random() * 50) + 30;
        const newCount = prev + increment;
        return newCount > 850 ? 40 : newCount;
      });
    }, 30000);

    const eyeInterval = setInterval(() => {
      setIsEyeOpen(false);
      setTimeout(() => setIsEyeOpen(true), 200);
    }, 3000);

    return () => {
      clearInterval(viewCountInterval);
      clearInterval(eyeInterval);
    };
  }, [product]);

  // Add to Cart Functionality
  const handleAddToCart = async () => {
    if (!product) return;

    if (isProductInCart) {
      navigate("/cart");
      return;
    }

    const result = await addToCart(
      {
        id: product._id,
        title: product.name,
        price: product.sellingPrice,
        originalPrice: product.offerPrice,
        image: product?.images?.[0]?.url || product?.images?.[0],
        description: product.description,
        rating: product.ratingAverage,
        category: product.category?.name,
        sku: product.sku,
      },
      quantity,
    );

    if (result.success) {
      toast.success(
        <div className="flex flex-col">
          <span className="font-bold text-base">Success!</span>
          <span className="text-sm">{product.name} added to cart!</span>
        </div>,
        {
          icon: "🛒",
          style: {
            borderRadius: "8px",
            background: "#111",
            color: "#fff",
            padding: "12px 16px",
          },
        },
      );
    } else {
      toast.error(result.message || "Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    if (!isProductInCart) {
      await addToCart(
        {
          id: product._id,
          title: product.name,
          price: product.sellingPrice,
          originalPrice: product.offerPrice,
          image: product?.images?.[0]?.url || product?.images?.[0],
          description: product.description,
          rating: product.ratingAverage,
          category: product.category?.name,
          sku: product.sku,
        },
        quantity,
      );
    }
    navigate("/checkout");
  };

  const updateProductQuantity = (newQty) => {
    setQuantity(newQty);
    if (isProductInCart) {
      updateQuantity(product._id, newQty);
    }
  };

  const increaseQuantity = () => updateProductQuantity(quantity + 1);
  const decreaseQuantity = () =>
    updateProductQuantity(quantity > 1 ? quantity - 1 : 1);

  // Wishlist Functionality
  const handleWishlistClick = () => {
    if (!product) return;

    if (isProductInWishlist) {
      removeFromWishlist(product._id);
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
                    {product.name} has been removed
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
        id: product._id,
        title: product.name,
        price: product.sellingPrice,
        originalPrice: product.offerPrice,
        image: product?.images?.[0]?.url || product?.images?.[0],
        description: product.description,
        rating: product.ratingAverage,
        category: product.category?.name,
        inStock: true,
      });

      toast.success(
        <div>
          <p className="font-semibold">Added to wishlist!</p>
          <p className="text-sm">{product.name}</p>
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
        />,
      );
    }
    return stars;
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product?.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + product?.images.length) % product?.images.length,
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
    if (!product) return null;

    switch (activeTab) {
      case "DESCRIPTION":
        return (
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>
        );
      case "DETAILS":
        return (
          <div className="text-gray-600 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 text-gray-800 border-b pb-2">
                  Material & Design
                </h4>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center">
                    <span className="text-sm md:text-base text-gray-500">
                      Material:
                    </span>
                    <span className="text-sm font-medium capitalize text-gray-900">
                      {product.material || "N/A"}
                    </span>
                  </li>
                  {product.purity && product.purity !== "na" && (
                    <li className="flex justify-between items-center">
                      <span className="text-sm md:text-base text-gray-500">
                        Purity:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.purity}
                      </span>
                    </li>
                  )}
                  {product.brand && (
                    <li className="flex justify-between items-center">
                      <span className="text-sm md:text-base text-gray-500">
                        Brand:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.brand}
                      </span>
                    </li>
                  )}
                  <li className="flex justify-between items-center">
                    <span className="text-sm md:text-base text-gray-500">
                      Gender:
                    </span>
                    <span className="text-sm font-medium capitalize text-gray-900">
                      {product.gender}
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-gray-800 border-b pb-2">
                  Measurements & IDs
                </h4>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center">
                    <span className="text-sm md:text-base text-gray-500">
                      SKU:
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {product.sku}
                    </span>
                  </li>
                  {product.weight > 0 && (
                    <li className="flex justify-between items-center">
                      <span className="text-sm md:text-base text-gray-500">
                        Weight:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.weight}g
                      </span>
                    </li>
                  )}
                  {product.dimensions &&
                    (product.dimensions.length ||
                      product.dimensions.width ||
                      product.dimensions.height) && (
                      <li className="flex justify-between items-center">
                        <span className="text-sm md:text-base text-gray-500">
                          Dimensions:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {product.dimensions.length || 0} x{" "}
                          {product.dimensions.width || 0} x{" "}
                          {product.dimensions.height || 0} mm
                        </span>
                      </li>
                    )}
                  <li className="flex justify-between items-center">
                    <span className="text-sm md:text-base text-gray-500">
                      Stock Status:
                    </span>
                    <span
                      className={`text-sm font-medium ${product.stockQuantity > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "REVIEWS":
        return (
          <div className="text-gray-600 space-y-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {product.ratingAverage || 0}
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(product.ratingAverage || 0)}
                </div>
                <div className="text-sm text-gray-500">
                  {product.numReviews || 0} reviews
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">
                          {review.user?.firstName} {review.user?.lastName}
                        </h4>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-center py-8">
                  No reviews yet for this product.
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "The product you're looking for doesn't exist or is currently unavailable."}
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const productImages =
    product?.images?.length > 0
      ? product?.images.map((img) => img.url || img)
      : [BigImg];

  return (
    <div className="min-h-screen bg-white">
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
            <div
              className="flex justify-center mx-auto mb-6 relative group cursor-crosshair"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                ref={imgRef}
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full max-w-lg h-auto max-h-[500px] object-contain transition-transform duration-300 hover:scale-105"
              />

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

              {isHovering && (
                <div className="hidden md:block absolute top-1/2 left-[100%] -translate-y-1/2 w-[610px] h-[500px] border border-gray-200 overflow-hidden z-10 bg-white shadow-lg rounded-md">
                  <img
                    src={productImages[selectedImageIndex]}
                    alt="Zoomed"
                    className="absolute object-contain transition-transform duration-100 pt-14"
                    style={{
                      transform: `translate(-${zoomPos.x}%, -${zoomPos.y}%) scale(1.7)`,
                      transformOrigin: "top left",
                    }}
                  />
                </div>
              )}

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
                  {productImages.map((image, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 cursor-pointer border-2 transition-all duration-300 ${
                        selectedImageIndex === index
                          ? "border-orange-500 shadow-md"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
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
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Link to="/" className="cursor-pointer hover:text-gray-700">
                  Home
                </Link>
                <span className="text-gray-400">|</span>
                <Link
                  to="/products"
                  className="cursor-pointer hover:text-gray-700"
                >
                  Products
                </Link>
                <span className="text-gray-400">|</span>
                <span className="text-gray-800 font-medium">Details</span>
              </div>

              <p className="text-yellow-700 uppercase tracking-wider">
                {product.category?.name || "Premium Collection"}
              </p>
              <h1 className="text-3xl font-bold text-gray-800">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-semibold text-gray-700 flex items-center gap-1">
                    <BsCurrencyRupee />
                    {product.sellingPrice}
                  </p>
                  {product.isOnOffer &&
                    product.sellingPrice < product.offerPrice && (
                      <p className="text-lg text-gray-500 line-through flex items-center gap-1">
                        <BsCurrencyRupee />
                        {product.offerPrice}
                      </p>
                    )}
                </div>
                {product.stockQuantity > 0 ? (
                  <span className="text-green-600 font-medium">In Stock</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(product.ratingAverage || 0)}
                  </div>
                  <span className="text-gray-600 text-sm">
                    ({product.numReviews || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={`p-2 hover:bg-gray-50 transition-all duration-300 hover:scale-110 ${
                      isProductInWishlist
                        ? "text-red-500"
                        : "text-gray-600 hover:text-red-500"
                    }`}
                    onClick={handleWishlistClick}
                  >
                    {isProductInWishlist ? (
                      <BsHeartFill className="text-xl" />
                    ) : (
                      <BsHeart className="text-xl" />
                    )}
                  </button>
                  <button className="p-2 hover:bg-gray-50 transition-all duration-300 hover:scale-110">
                    <BsShare className="text-xl text-gray-600 hover:text-blue-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-200">
                  <button
                    onClick={decreaseQuantity}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-bold min-w-[50px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  className="flex-1 bg-black text-white py-4 px-6 hover:bg-gray-800 transition-all duration-300 font-bold uppercase tracking-wide disabled:bg-gray-400 disabled:cursor-not-allowed transform active:scale-95"
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity <= 0}
                >
                  {product.stockQuantity > 0
                    ? isProductInCart
                      ? "Go to Cart"
                      : "Add to Cart"
                    : "Out of Stock"}
                </button>
                <button
                  className="flex-1 bg-white text-black border-2 border-black py-4 px-6 hover:bg-gray-50 transition-all duration-300 font-bold uppercase tracking-wide disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transform active:scale-95"
                  onClick={handleBuyNow}
                  disabled={product.stockQuantity <= 0}
                >
                  Buy Now
                </button>
              </div>

              <div className="border-t pt-4 space-y-1 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category?.name}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium capitalize">
                    {product.material || "N/A"}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    {isEyeOpen ? (
                      <BsEyeFill className="text-2xl text-blue-600 animate-pulse" />
                    ) : (
                      <BsEye className="text-2xl text-blue-600" />
                    )}
                    <span className="text-lg font-semibold text-gray-700">
                      Currently Viewing:{" "}
                      <span className="text-blue-600 font-bold text-xl">
                        {viewCount}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-gray-200">
                {["DESCRIPTION", "DETAILS", "REVIEWS"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-3 px-6 font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-black text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:w-3/4 py-4">{renderTabContent()}</div>
          </div>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  );
};

export default ProductDetails;
