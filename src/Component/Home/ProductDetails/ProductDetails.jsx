import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import {
  BsArrowLeft,
  BsHeart,

  BsStarFill,
  BsChevronLeft,
  BsChevronRight,
  BsEye,
  BsEyeFill,
  BsCurrencyRupee,
  BsHeartFill,
} from "react-icons/bs";
import toast from "react-hot-toast";
import RelatedProducts from "./RelatedProduct";
import BigImg from "../../../assets/ProductDetails/DetailsMainImg.webp";
import sone from "../../../assets/ProductDetails/sone.webp";
import stwo from "../../../assets/ProductDetails/stwo.webp";
import sthree from "../../../assets/ProductDetails/sthree.webp";
import sfour from "../../../assets/ProductDetails/sfour.webp";
import { useWishlist } from "../../Context/WishlistContext";
import { useCart } from "../../Context/CartContext";

import productApi from "../../../apis/productApi";
import reviewApi from "../../../apis/reviewApi";
import userApi from "../../../apis/user/userApi";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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
  const reviewsSectionRef = useRef(null);
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (thumbnailContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = thumbnailContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    title: "",
  });

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

  // Handle review redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (product && params.get("review") === "true") {
      setActiveTab("REVIEWS");
      setShowReviewForm(true);
      setTimeout(() => {
        reviewsSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 500);
    }
  }, [location.search, product]);

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
          const errorMsg =
            err.data?.message || err.message || "Failed to fetch product";
          setError(errorMsg);
          toast.error(errorMsg);
        },
      });
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch product data
  useEffect(() => {
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

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
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
        stockQuantity: product.stockQuantity,
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
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // Add to cart first so it's preserved after redirect/login
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
    if (!isLoggedIn) {
      toast.error("Please login to proceed to checkout", {
        icon: "🔒",
        duration: 3000,
      });
      setTimeout(
        () => navigate(`/login?redirect=${encodeURIComponent("/checkout")}`),
        1000,
      );
      return;
    }
    // Check if user is logged in
    else if (isLoggedIn) {
      navigate("/checkout");
    }
  };

  const updateProductQuantity = (newQty) => {
    setQuantity(newQty);
    if (isProductInCart) {
      updateQuantity(product._id, newQty);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stockQuantity) {
      updateProductQuantity(quantity + 1);
    } else {
      toast.error(`Only ${product.stockQuantity} units available in stock`);
    }
  };
  const decreaseQuantity = () =>
    updateProductQuantity(quantity > 1 ? quantity - 1 : 1);

  // Wishlist Functionality
  const handleWishlistClick = () => {
    if (!product) return;

    if (isProductInWishlist) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
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

      toast.success('Added to wishlist');
    }
  };



  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const renderStars = (rating, size = "text-sm") => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <BsStarFill
          key={i}
          className={`${size} ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
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

  const scrollToReviews = () => {
    setActiveTab("REVIEWS");
    setTimeout(() => {
      reviewsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleRatingClick = () => {
    scrollToReviews();
    setShowReviewForm(true);
  };

  const scrollThumbnails = (direction) => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 100;
      thumbnailContainerRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!userApi.isAuthenticated()) {
      toast.error("Please login to write a review");
      navigate(`/login?redirect=/product/${id}`);
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error("Please add a comment");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await reviewApi.createReview({
        data: {
          productId: id,
          rating: newReview.rating,
          comment: newReview.comment,
          title: newReview.title || "Product Review",
        },
        onSuccess: (response) => {
          toast.success("Review submitted successfully!");
          setShowReviewForm(false);
          setNewReview({ rating: 5, comment: "", title: "" });
          fetchProduct(); // Refresh product data to show new review and updated rating
        },
        onError: (err) => {
          toast.error(
            err.data?.message || err.message || "Failed to submit review",
          );
        },
      });
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const cleanDescription = (content) => {
    if (!content) return "";
    const txt = document.createElement("textarea");
    txt.innerHTML = content;
    return txt.value.replace(/<[^>]*>/g, "");
  };

  const renderTabContent = () => {
    if (!product) return null;

    switch (activeTab) {
      case "DESCRIPTION": {
        const raw = cleanDescription(product.description) || "";
        const LIMIT = 300;
        const isLong = raw.length > LIMIT;
        const displayed = isLong && !showFullDesc ? raw.slice(0, LIMIT) + "..." : raw;
        return (
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words w-full overflow-hidden">
              {displayed}
            </p>
            {isLong && (
              <button
                onClick={() => setShowFullDesc((prev) => !prev)}
                className="mt-3 text-sm font-semibold text-[#a67c00] hover:underline transition-all"
              >
                {showFullDesc ? "See Less ↑" : "See More ↓"}
              </button>
            )}
          </div>
        );
      }
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
          <div className="text-gray-600 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-6 border-b border-gray-100">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-light text-gray-900 leading-none mb-2">
                    {product.ratingAverage > 0
                      ? parseFloat(product.ratingAverage).toFixed(1)
                      : "0.0"}
                  </div>
                  <div className="flex items-center justify-center gap-0.5 mb-1">
                    {renderStars(Math.round(product.ratingAverage || 0), "text-sm")}
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    {product.ratingCount || 0} Reviews
                  </p>
                </div>
                <div className="h-12 w-px bg-gray-200 hidden md:block" />
                <p className="hidden md:block text-sm text-gray-500 max-w-[220px] leading-relaxed">
                  Average customer rating based on {product.ratingCount || 0} verified reviews.
                </p>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full md:w-auto bg-[#C19A6B] text-white px-8 py-3 font-semibold text-xs uppercase tracking-[0.15em] hover:bg-[#A07A4B] transition-all active:scale-[0.98]"
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            </div>

            {showReviewForm && (
              <div className="bg-white border border-gray-100 p-8 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  Share Your Experience
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                </h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Your Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setNewReview({ ...newReview, rating: star })
                          }
                          className={`text-2xl transition-all duration-200 ${
                            star <= newReview.rating
                              ? "text-yellow-400 scale-110"
                              : "text-gray-300 hover:text-yellow-200"
                          }`}
                        >
                          <BsStarFill />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                        Review Title
                      </label>
                      <input
                        type="text"
                        value={newReview.title}
                        onChange={(e) =>
                          setNewReview({ ...newReview, title: e.target.value })
                        }
                        placeholder="Sum up your experience"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                        Your Feedback
                      </label>
                      <textarea
                        rows="4"
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            comment: e.target.value,
                          })
                        }
                        placeholder="What did you like or dislike?"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-[#C19A6B] text-white px-10 py-3 font-semibold text-xs uppercase tracking-[0.15em] disabled:bg-gray-400 hover:bg-[#A07A4B] transition-all flex items-center gap-3"
                    >
                      {isSubmittingReview ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        "Post Review"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="group bg-white p-6 border border-gray-100 hover:border-[#C19A6B]/20 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg border border-gray-100">
                          {review.user?.firstName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {review.user?.firstName} {review.user?.lastName}
                          </h4>
                          <div className="flex items-center gap-1 mt-0.5">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-xs text-gray-400 font-medium">
                              Verified Purchase
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                        {new Date(review.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    {review.title && (
                      <h5 className="font-bold text-gray-800 mb-2">
                        {review.title}
                      </h5>
                    )}
                    <p className="text-gray-600 leading-relaxed italic">
                      "{review.comment}"
                    </p>

                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-6">
                      <button className="text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest flex items-center gap-1.5">
                        Helpful ({review.likes || 0})
                      </button>
                      <button className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest">
                        Report
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 border border-dashed border-gray-200">
                  <p className="text-sm text-gray-400 mb-1">No reviews yet</p>
                  <p className="text-xs text-gray-400">Be the first to share your experience with this product.</p>
                </div>
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
            onClick={() => navigate(-1)}
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
              className="flex justify-center mx-auto mb-6 relative group cursor-crosshair bg-[#F8F7F5] border border-gray-100"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                ref={imgRef}
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full max-w-lg h-auto max-h-[550px] object-contain p-8 transition-transform duration-500"
              />

              {isHovering && (
                <div
                  className="hidden md:block absolute pointer-events-none border border-[#C19A6B]/50"
                  style={{
                    width: "150px",
                    height: "150px",
                    left: `calc(${zoomPos.x}% - 50px)`,
                    top: `calc(${zoomPos.y}% - 50px)`,
                    backgroundColor: "rgba(193,154,107,0.08)",
                    boxShadow: "0 0 8px rgba(193,154,107,0.2)",
                    zIndex: 10,
                  }}
                ></div>
              )}

              {isHovering && (
                <div className="hidden md:block absolute top-0 left-[100%] ml-4 w-[500px] h-[500px] border border-gray-100 overflow-hidden z-10 bg-white shadow-xl">
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
                {canScrollLeft && (
                  <button
                    onClick={() => scrollThumbnails("left")}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 hover:scale-110 flex-shrink-0"
                  >
                    <BsChevronLeft className="text-gray-600" />
                  </button>
                )}

                <div
                  ref={thumbnailContainerRef}
                   onScroll={checkScroll}
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
                          ? "border-[#C19A6B]"
                          : "border-gray-100 hover:border-gray-300"
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

                {canScrollRight && (
                  <button
                    onClick={() => scrollThumbnails("right")}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 hover:scale-110 flex-shrink-0"
                  >
                    <BsChevronRight className="text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs text-gray-400 tracking-wide">
                <Link to="/" className="hover:text-[#C19A6B] transition-colors">Home</Link>
                <span>/</span>
                <span onClick={() => navigate(-1)} className="cursor-pointer hover:text-[#C19A6B] transition-colors">Shop</span>
                <span>/</span>
                <span className="text-gray-700">{product.name}</span>
              </nav>

              {/* Category + Badge */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C19A6B] border border-[#C19A6B]/30 px-3 py-1">
                  {product.category?.name || "Collection"}
                </span>
                {product.isNewArrival && (
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white bg-black px-3 py-1">New</span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-2xl md:text-3xl font-light text-gray-900 leading-tight tracking-wide">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3" onClick={scrollToReviews}>
                <div className="flex items-center gap-1">{renderStars(product.ratingAverage || 0)}</div>
                <span className="text-xs text-gray-500 cursor-pointer hover:text-[#C19A6B] transition-colors">
                  {product.ratingCount || 0} Reviews
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-gray-900 flex items-center">
                  <BsCurrencyRupee className="text-2xl" />
                  {(product.sellingPrice || 0).toLocaleString('en-IN')}
                </span>
                {product.isOnOffer && product.sellingPrice < product.offerPrice && (
                  <span className="text-lg text-gray-400 line-through flex items-center">
                    <BsCurrencyRupee className="text-sm" />
                    {(product.offerPrice || 0).toLocaleString('en-IN')}
                  </span>
                )}
                {product.isOnOffer && product.discountPercentage > 0 && (
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Tax hint */}
              <p className="text-xs text-gray-400">Inclusive of all taxes. Free shipping on orders above ₹5,000</p>

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Description */}
              <div>
                <p className="text-gray-600 text-sm leading-relaxed break-words overflow-hidden">
                  {(() => {
                    const raw = cleanDescription(product.description) || "";
                    const LIMIT = 200;
                    return showFullDesc || raw.length <= LIMIT ? raw : raw.slice(0, LIMIT) + "...";
                  })()}
                </p>
                {(cleanDescription(product.description) || "").length > 200 && (
                  <button onClick={() => setShowFullDesc(prev => !prev)} className="mt-1 text-xs font-semibold text-[#C19A6B] hover:underline">
                    {showFullDesc ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>

              {/* Stock + Wishlist */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`text-xs font-medium ${product.stockQuantity > 0 ? 'text-green-700' : 'text-red-600'}`}>
                    {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
                  </span>
                </div>
                <button
                  onClick={handleWishlistClick}
                  className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 border transition-all ${
                    isProductInWishlist
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-gray-200 text-gray-500 hover:border-[#C19A6B] hover:text-[#C19A6B]'
                  }`}
                >
                  {isProductInWishlist ? <BsHeartFill className="text-sm" /> : <BsHeart className="text-sm" />}
                  {isProductInWishlist ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-2">
              {/* Quantity */}
              {isProductInCart && (
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 border border-gray-100">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Quantity</span>
                  <div className="flex items-center gap-4">
                    <button onClick={decreaseQuantity} className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-700 hover:border-[#C19A6B] transition-colors">−</button>
                    <span className="text-sm font-bold w-8 text-center">{quantity}</span>
                    <button onClick={increaseQuantity} className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-700 hover:border-[#C19A6B] transition-colors">+</button>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="bg-[#C19A6B] text-white py-4 font-semibold uppercase tracking-[0.15em] text-xs hover:bg-[#A07A4B] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-[0.98]"
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity <= 0}
                >
                  {product.stockQuantity > 0 ? (isProductInCart ? 'View Cart' : 'Add to Cart') : 'Sold Out'}
                </button>
                <button
                  className="bg-gray-900 text-white py-4 font-semibold uppercase tracking-[0.15em] text-xs hover:bg-black transition-all disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-[0.98]"
                  onClick={handleBuyNow}
                  disabled={product.stockQuantity <= 0}
                >
                  Buy Now
                </button>
              </div>

              {/* Product Meta */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center py-3 bg-gray-50 border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">SKU</p>
                  <p className="text-xs font-semibold text-gray-800 mt-1">{product.sku}</p>
                </div>
                <div className="text-center py-3 bg-gray-50 border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Material</p>
                  <p className="text-xs font-semibold text-gray-800 mt-1 capitalize">{product.material || 'N/A'}</p>
                </div>
                <div className="text-center py-3 bg-gray-50 border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Purity</p>
                  <p className="text-xs font-semibold text-gray-800 mt-1 uppercase">{product.purity || 'N/A'}</p>
                </div>
              </div>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-gray-500">
                <BsEyeFill className="text-[#C19A6B] animate-pulse" />
                <span><strong className="text-gray-700">{viewCount}</strong> people viewing this right now</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16" ref={reviewsSectionRef}>
          {/* Tab Headers */}
          <div className="flex justify-center border-b border-gray-200 mb-10">
            {["DESCRIPTION", "DETAILS", "REVIEWS"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C19A6B]" />
                )}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">{renderTabContent()}</div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      {relatedProducts && relatedProducts.length >= 2 && product && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-[#FAFAF8] border border-gray-100 rounded-2xl p-6 md:p-8">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-widest mb-6">
              Frequently Bought Together
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
              {/* Current Product */}
              <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 flex-1 min-w-0">
                <img
                  src={product.images?.[0]?.url || BigImg}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm font-bold text-[#C19A6B] flex items-center mt-1">
                    <BsCurrencyRupee className="text-xs" />
                    {(product.sellingPrice || product.basePrice || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <span className="text-2xl font-light text-gray-300 hidden md:block">+</span>
              <span className="text-xl font-light text-gray-300 md:hidden">+</span>

              {/* Related Product 1 */}
              <div
                className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 cursor-pointer hover:border-[#C19A6B]/40 transition-colors flex-1 min-w-0"
                onClick={() => navigate(`/product/${relatedProducts[0].slug || relatedProducts[0]._id}`)}
              >
                <img
                  src={relatedProducts[0].images?.[0]?.url || BigImg}
                  alt={relatedProducts[0].name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{relatedProducts[0].name}</p>
                  <p className="text-sm font-bold text-[#C19A6B] flex items-center mt-1">
                    <BsCurrencyRupee className="text-xs" />
                    {(relatedProducts[0].sellingPrice || relatedProducts[0].basePrice || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <span className="text-2xl font-light text-gray-300 hidden md:block">+</span>
              <span className="text-xl font-light text-gray-300 md:hidden">+</span>

              {/* Related Product 2 */}
              <div
                className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 cursor-pointer hover:border-[#C19A6B]/40 transition-colors flex-1 min-w-0"
                onClick={() => navigate(`/product/${relatedProducts[1].slug || relatedProducts[1]._id}`)}
              >
                <img
                  src={relatedProducts[1].images?.[0]?.url || BigImg}
                  alt={relatedProducts[1].name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{relatedProducts[1].name}</p>
                  <p className="text-sm font-bold text-[#C19A6B] flex items-center mt-1">
                    <BsCurrencyRupee className="text-xs" />
                    {(relatedProducts[1].sellingPrice || relatedProducts[1].basePrice || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* = Total + Add All */}
              <div className="flex flex-col items-center gap-3 md:pl-4 md:border-l border-gray-200 min-w-[150px] pt-4 md:pt-0 border-t md:border-t-0">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Bundle Price</p>
                  <p className="text-xl font-bold text-gray-900 flex items-center justify-center">
                    <BsCurrencyRupee />
                    {(
                      (product.sellingPrice || product.basePrice || 0) +
                      (relatedProducts[0]?.sellingPrice || relatedProducts[0]?.basePrice || 0) +
                      (relatedProducts[1]?.sellingPrice || relatedProducts[1]?.basePrice || 0)
                    ).toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    [product, relatedProducts[0], relatedProducts[1]].forEach(p => {
                      addToCart({
                        id: p._id,
                        title: p.name,
                        price: p.sellingPrice || p.basePrice,
                        image: p.images?.[0]?.url,
                      }, 1);
                    });
                    toast.success('All items added to cart!', { icon: '🛒' });
                  }}
                  className="w-full bg-[#C19A6B] text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-colors"
                >
                  Add All to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-[#C19A6B]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#C19A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Certified Authentic</p>
              <p className="text-[10px] text-gray-500">BIS Hallmarked</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-[#C19A6B]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#C19A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Free Shipping</p>
              <p className="text-[10px] text-gray-500">Orders above 5000</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-[#C19A6B]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#C19A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Easy Returns</p>
              <p className="text-[10px] text-gray-500">7-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-[#C19A6B]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#C19A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Secure Payment</p>
              <p className="text-[10px] text-gray-500">SSL encrypted</p>
            </div>
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
