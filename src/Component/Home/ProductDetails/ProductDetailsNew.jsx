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
import { MdOutlineCurrencyRupee } from "react-icons/md";
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
import reviewApi from "../../../apis/reviewApi";

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
  const reviewsSectionRef = useRef(null);

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

  const handleShare = () => {
    if (!product) return;
    const productUrl = `${window.location.origin}/product/${product._id}`;

    navigator.clipboard
      .writeText(productUrl)
      .then(() => {
        toast.success("Link copied to clipboard!", {
          icon: "🔗",
          style: {
            borderRadius: "8px",
            background: "#111",
            color: "#fff",
            padding: "12px 16px",
          },
        });
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy link");
      });
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
    const token = localStorage.getItem("rememberToken");

    if (!token) {
      toast.error("Please login to write a review");
      navigate("/login");
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

  const renderTabContent = () => {
    if (!product) return null;

    switch (activeTab) {
      case "DESCRIPTION": {
        const raw = (product.description || "").replace(/<[^>]*>/g, "");
        const LIMIT = 300;
        const isLong = raw.length > LIMIT;
        const displayed = isLong && !showFullDesc ? raw.slice(0, LIMIT) + "..." : raw;
        return (
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-6xl font-black text-gray-900 leading-none mb-2">
                    {product.ratingAverage > 0
                      ? parseFloat(product.ratingAverage).toFixed(1)
                      : "0.0"}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {renderStars(
                      Math.round(product.ratingAverage || 0),
                      "text-xl",
                    )}
                  </div>
                  <div className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                    Based on {product.ratingCount || 0} Reviews
                  </div>
                </div>
                <div className="h-16 w-px bg-gray-200 hidden md:block"></div>
                <div className="hidden md:block">
                  <p className="text-sm text-gray-600 max-w-[200px]">
                    Average customer rating based on {product.ratingCount || 0}{" "}
                    verified reviews.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full md:w-auto bg-black text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-black/10"
              >
                {showReviewForm ? "Cancel Review" : "Write a Review"}
              </button>
            </div>

            {showReviewForm && (
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-xl animate-fadeIn">
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
                      className="bg-black text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest disabled:bg-gray-400 hover:bg-gray-800 transition-all flex items-center gap-3 shadow-xl shadow-black/10"
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
                    className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
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
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full">
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
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    No reviews yet
                  </h3>
                  <p className="text-gray-500">
                    Be the first to share your thoughts on this product!
                  </p>
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

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link to="/" className="hover:text-[#C19A6B] transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            to="/categories"
            className="hover:text-[#C19A6B] transition-colors"
          >
            Categories
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium truncate">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div
              className="relative aspect-square bg-[#FBFBFB] rounded-2xl overflow-hidden group border border-gray-100 shadow-sm"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                ref={imgRef}
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain p-8 md:p-12 transition-transform duration-700 ease-out group-hover:scale-110"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onMouseMove={handleMouseMove}
              />

              {isHovering && (
                <div className="hidden lg:block absolute inset-0 pointer-events-none z-20">
                  <div
                    className="absolute border-2 border-[#C19A6B]/30 bg-white/10 backdrop-blur-[2px] shadow-2xl"
                    style={{
                      width: "150px",
                      height: "150px",
                      left: `calc(${zoomPos.x}% - 75px)`,
                      top: `calc(${zoomPos.y}% - 75px)`,
                    }}
                  />
                </div>
              )}

              {isHovering && (
                <div className="hidden xl:block absolute top-0 left-full ml-8 w-[600px] h-[600px] border border-gray-100 rounded-2xl overflow-hidden z-[100] bg-white shadow-2xl">
                  <img
                    src={productImages[selectedImageIndex]}
                    alt="Zoomed"
                    className="absolute max-w-none transition-transform duration-100"
                    style={{
                      width: "200%",
                      height: "200%",
                      transform: `translate(-${zoomPos.x / 2}%, -${zoomPos.y / 2}%) scale(1.5)`,
                      transformOrigin: "0 0",
                    }}
                  />
                </div>
              )}

              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <button
                  onClick={prevImage}
                  className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-[#C19A6B] hover:text-white text-gray-800 rounded-full shadow-lg transition-all"
                >
                  <BsChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-[#C19A6B] hover:text-white text-gray-800 rounded-full shadow-lg transition-all"
                >
                  <BsChevronRight />
                </button>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-1">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImageIndex === index
                      ? "border-[#C19A6B] scale-105 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#C19A6B]/10 text-[#C19A6B] text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {product.category?.name || "Premium Collection"}
                </span>
                {product.isNewArrival && (
                  <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    New Arrival
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#C19A6B] flex items-center">
                    <MdOutlineCurrencyRupee className="text-2xl" />
                    {product.sellingPrice}
                  </span>
                  {product.isOnOffer &&
                    product.sellingPrice < product.offerPrice && (
                      <span className="text-xl text-gray-400 line-through flex items-center decoration-red-500/30">
                        <MdOutlineCurrencyRupee className="text-lg" />
                        {product.offerPrice}
                      </span>
                    )}
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                  <div className="flex items-center gap-0.5">
                    {renderStars(product.ratingAverage || 0)}
                  </div>
                  <button
                    onClick={scrollToReviews}
                    className="text-xs font-semibold text-gray-500 hover:text-black"
                  >
                    ({product.ratingCount || 0} Reviews)
                  </button>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-gray-100 pl-6 py-2">
              <p className="leading-relaxed text-gray-600 text-base">
                {(() => {
                  const raw = (product.description || "").replace(/<[^>]*>/g, "");
                  const LIMIT = 300;
                  return showFullDesc || raw.length <= LIMIT
                    ? raw
                    : raw.slice(0, LIMIT) + "...";
                })()}
              </p>
              {(product.description || "").replace(/<[^>]*>/g, "").length > 300 && (
                <button
                  onClick={() => setShowFullDesc((prev) => !prev)}
                  className="mt-2 text-sm font-semibold text-[#a67c00] hover:underline transition-all"
                >
                  {showFullDesc ? "See Less ↑" : "See More ↓"}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-6 pt-4">
              <div className="flex items-center justify-between group/action">
                <div className="flex items-center gap-6">
                  <button
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all duration-300 ${
                      isProductInWishlist
                        ? "bg-red-50 border-red-100 text-red-500"
                        : "border-gray-200 text-gray-600 hover:border-[#C19A6B] hover:text-[#C19A6B]"
                    }`}
                    onClick={handleWishlistClick}
                  >
                    {isProductInWishlist ? <BsHeartFill /> : <BsHeart />}
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Wishlist
                    </span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300"
                  >
                    <BsShare />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Share
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${product.stockQuantity > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                  />
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${product.stockQuantity > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {product.stockQuantity > 0
                      ? "Perfectly In Stock"
                      : "Out of Stock"}
                  </span>
                </div>
              </div>

              {isProductInCart && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-6">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Quantity
                  </span>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={decreaseQuantity}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-900 shadow-sm hover:border-[#C19A6B] hover:text-[#C19A6B] transition-colors"
                    >
                      <span className="text-xl">-</span>
                    </button>
                    <span className="text-xl font-bold w-12 text-center text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-900 shadow-sm hover:border-[#C19A6B] hover:text-[#C19A6B] transition-colors"
                    >
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  className="group relative overflow-hidden bg-[#C19A6B] text-white px-8 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-500 hover:bg-gray-900 hover:shadow-2xl hover:shadow-[#C19A6B]/20 disabled:bg-gray-300 transform active:scale-95"
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity <= 0}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isProductInCart ? "View In Cart" : "Enchanting Add"}
                  </span>
                </button>
                <button
                  className="group bg-white text-[#C19A6B] border-2 border-[#C19A6B] px-8 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-500 hover:bg-[#C19A6B] hover:text-white disabled:opacity-50 transform active:scale-95"
                  onClick={handleBuyNow}
                  disabled={product.stockQuantity <= 0}
                >
                  Bespoke Purchase
                </button>
              </div>

              <div className="bg-[#C19A6B]/5 p-4 rounded-xl border border-[#C19A6B]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <BsEyeFill className="text-xl text-[#C19A6B] animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#C19A6B] rounded-full border border-white" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">
                    Presence:{" "}
                    <span className="text-gray-900 ml-1">
                      {viewCount} enthusiasts
                    </span>
                  </span>
                </div>
                <div className="text-[10px] font-bold text-[#C19A6B] uppercase tracking-[0.15em] border-l border-[#C19A6B]/20 pl-4">
                  Handcrafted Elegance
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="mt-24">
          <div className="flex justify-center border-b border-gray-200">
            <div className="flex gap-12">
              {["DESCRIPTION", "DETAILS", "REVIEWS"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-xs font-bold uppercase tracking-[0.3em] transition-all relative ${
                    activeTab === tab
                      ? "text-black"
                      : "text-gray-400 hover:text-gray-900"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C19A6B] animate-in slide-in-from-bottom-6" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto py-12 px-4 min-h-[400px]">
            {renderTabContent()}
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
