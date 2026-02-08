import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
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

  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
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
                <div
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
                  onClick={scrollToReviews}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-gray-900 mr-1">
                      {product.ratingAverage > 0
                        ? parseFloat(product.ratingAverage).toFixed(1)
                        : "0.0"}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {renderStars(product.ratingAverage || 0)}
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs font-medium border-l pl-2">
                    {product.ratingCount || 0} Reviews
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-xs font-bold text-black underline uppercase tracking-widest hover:text-orange-500 transition-colors"
                    onClick={handleRatingClick}
                  >
                    Rate this product
                  </button>
                  <span className="text-gray-300">|</span>
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
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-50 transition-all duration-300 hover:scale-110"
                    title="Share product"
                  >
                    <BsShare className="text-xl text-gray-600 hover:text-blue-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {isProductInCart && (
                <div className="flex items-center justify-between animate-fadeIn">
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
              )}

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

        <div className="mt-12" ref={reviewsSectionRef}>
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
