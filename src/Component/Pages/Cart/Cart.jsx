import React, { useState, useEffect } from "react";
import {
  BsCurrencyRupee,
  BsTrash,
  BsArrowLeft,
  BsPlus,
  BsDash,
  BsBagCheck,
  BsTruck,
  BsShieldCheck,
  BsArrowRepeat,
  BsTicketPerforated,
} from "react-icons/bs";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../../Context/CartContext";
import Banner from "../../Common/Banner";
import cartApi from "../../../apis/cartApi";

const Cart = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [availablePromos, setAvailablePromos] = useState([]);
  const [isLoadingPromos, setIsLoadingPromos] = useState(false);

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    appliedPromo,
    setAppliedPromo,
  } = useCart();

  // Auto-apply promo code from URL parameter
  useEffect(() => {
    const promoFromUrl = searchParams.get("promo");
    if (promoFromUrl && !appliedPromo) {
      setPromoCode(promoFromUrl);
      handleApplyPromo(promoFromUrl);
      searchParams.delete("promo");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, appliedPromo]);

  // Fetch available promo codes
  useEffect(() => {
    const timer = setTimeout(() => {
      cartApi.getPromoCodes({
        setLoading: setIsLoadingPromos,
        onSuccess: (response) => {
          const promos = response?.data?.promoCodes || [];
          setAvailablePromos(promos);
        },
        onError: (err) => {
          console.error("Error fetching promo codes:", err);
        },
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleRemoveItem = (item, e) => {
    e.stopPropagation();
    removeFromCart(item.id);

    toast.success(
      <div>
        <p className="font-semibold">Removed from cart!</p>
        <p className="text-sm">{item.title}</p>
      </div>,
      {
        icon: "🗑️",
        duration: 3000,
        style: {
          background: "#f0f9ff",
          border: "1px solid #bae6fd",
        },
      },
    );
  };

  const handleApplyPromo = (codeToApply) => {
    const code = codeToApply || promoCode;
    if (!code.trim()) {
      toast.error("Please enter a promo code!");
      return;
    }

    cartApi.applyPromoCode({
      code: code,
      setLoading: setIsApplyingPromo,
      onSuccess: (response) => {
        if (response.status === "success") {
          const promo = response.data.promoCode;
          const subtotal = getSubtotal();
          const discountAmount = (subtotal * promo.discountPercentage) / 100;

          setAppliedPromo({
            code: promo.code,
            discountPercentage: promo.discountPercentage,
            discountAmount: discountAmount,
          });
          toast.success(
            `'${promo.code}' applied! You saved ₹${discountAmount.toFixed(2)}`,
          );
          setPromoCode("");
        }
      },
      onError: (error) => {
        console.error("Error applying promo code:", error);
        const errorMessage =
          error.response?.data?.message || "Invalid promo code!";
        toast.error(errorMessage);
      },
    });
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast.success("Promo code removed");
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("Please login to proceed to checkout", {
        icon: "🔒",
        duration: 3000,
      });
      // Navigate to login page with redirect param
      setTimeout(() => navigate("/login?redirect=/checkout"), 1000);
      return;
    }

    toast.success("Proceeding to checkout!", {
      icon: "🛒",
      duration: 2000,
    });

    // Navigate to checkout page
    setTimeout(() => navigate("/checkout"), 1000);
  };

  const handleContinueShopping = () => {
    navigate("/categories");
  };

  const handleQuantityChange = (itemId, value) => {
    const quantity = parseInt(value) || 1;
    const item = cartItems.find((i) => i.id === itemId);
    const maxLimit = item?.stockQuantity || 10;

    if (quantity >= 1 && quantity <= maxLimit) {
      updateQuantity(itemId, quantity);
    } else if (quantity > maxLimit) {
      toast.error(`Only ${maxLimit} units available`);
      updateQuantity(itemId, maxLimit);
    }
  };

  const calculateItemTotal = (item) => {
    const price = item.price || 0;
    return price * item.quantity;
  };

  // Debug log to check cart items
  console.log("Cart Items in Cart Page:", cartItems);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
                @keyframes slideInLeft {
                    from {
                        transform: translateX(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
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
                
                @keyframes scaleIn {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeInUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .animate-slideInLeft {
                    animation: slideInLeft 0.3s ease-out;
                }
                
                .animate-slideInRight {
                    animation: slideInRight 0.3s ease-out;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.5s ease-out;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            `}</style>

      {/* Top Banner for Cart Page */}
      <Banner page="cart" position="top" className="h-32 md:h-40" />

      <div className="max-w-[90%] mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 animate-fadeInUp">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <BsArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Continue Shopping</span>
            </button>

            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2 group"
              >
                <BsTrash className="text-sm group-hover:scale-110 transition-transform" />
                Clear Cart
              </button>
            )}
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-50 to-amber-100 mb-4 animate-scaleIn">
              <BsBagCheck className="text-3xl text-amber-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 animate-slideInLeft">
              Shopping Cart
            </h1>
            <p className="text-gray-600 animate-slideInLeft">
              {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>
        </div>

        {cartItems && cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items List */}
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-white shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg animate-scaleIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6 flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-full sm:w-40 h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image || "/placeholder-image.jpg"}
                        alt={item.title || "Product"}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {item.title || "Unnamed Product"}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleRemoveItem(item, e)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50"
                          title="Remove item"
                        >
                          <BsTrash className="text-lg" />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900 flex items-center">
                            <BsCurrencyRupee className="text-sm" />
                            {calculateItemTotal(item).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({item.quantity} ×{" "}
                            <BsCurrencyRupee className="inline" />
                            {item.price || 0})
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <BsDash className="text-gray-600" />
                          </button>

                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, e.target.value)
                            }
                            className="w-16 h-8 border border-gray-300 text-center text-gray-800 font-medium"
                          />

                          <button
                            onClick={() => {
                              if (
                                item.stockQuantity &&
                                item.quantity >= item.stockQuantity
                              ) {
                                toast.error(
                                  `Only ${item.stockQuantity} units available`,
                                );
                                return;
                              }
                              increaseQuantity(item.id);
                            }}
                            disabled={
                              item.quantity >= 10 ||
                              (item.stockQuantity &&
                                item.quantity >= item.stockQuantity)
                            }
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <BsPlus className="text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6 animate-slideInRight">
                {/* Order Summary Card */}
                <div className="bg-white shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
                    Order Summary
                  </h2>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium flex items-center">
                        <BsCurrencyRupee className="text-sm mr-1" />
                        {getSubtotal().toFixed(2)}
                      </span>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between text-green-600 animate-fadeInUp">
                        <span className="flex items-center gap-1">
                          Promo Discount ({appliedPromo.code})
                          <button
                            onClick={handleRemovePromo}
                            className="text-red-400 hover:text-red-600 text-xs"
                          >
                            (Remove)
                          </button>
                        </span>
                        <span className="font-medium flex items-center">
                          -<BsCurrencyRupee className="text-sm mr-1" />
                          {appliedPromo.discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Promo Code Section */}
                  <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Promo Code
                      </h3>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase">
                        Save More
                      </span>
                    </div>

                    {/* Input field */}
                    <div className="relative group">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="ENTER COUPON CODE"
                        className="w-full pl-4 pr-24 py-3 border-2 border-dashed border-gray-200 focus:border-amber-500 focus:ring-0 outline-none uppercase font-black text-sm transition-all bg-gray-50/50"
                      />
                      <button
                        onClick={() => handleApplyPromo()}
                        disabled={isApplyingPromo}
                        className="absolute right-1 top-1 bottom-1 px-6 bg-gray-900 text-white font-bold text-xs uppercase hover:bg-black transition-all disabled:opacity-50"
                      >
                        {isApplyingPromo ? "..." : "Apply"}
                      </button>
                    </div>

                    {/* Available Promos List - Production UI */}
                    {availablePromos.length > 0 ? (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                          <BsTicketPerforated className="h-4 w-4 text-amber-500" />
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                            Available Offers
                          </p>
                        </div>

                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                          {availablePromos.map((promo) => (
                            <div
                              key={promo._id}
                              onClick={() => {
                                if (appliedPromo?.code !== promo.code) {
                                  handleApplyPromo(promo.code);
                                }
                              }}
                              className={`relative group cursor-pointer border rounded-xl p-3 transition-all ${
                                appliedPromo?.code === promo.code
                                  ? "bg-amber-50 border-amber-200 shadow-sm ring-1 ring-amber-100"
                                  : "bg-white border-gray-100 hover:border-amber-200 hover:shadow-md"
                              }`}
                            >
                              <div className="flex justify-between items-center relative z-10">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono font-black text-sm text-gray-900 group-hover:text-amber-700 transition-colors">
                                      {promo.code}
                                    </span>
                                    {appliedPromo?.code === promo.code && (
                                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    )}
                                  </div>
                                  <p className="text-[10px] font-bold text-gray-500 uppercase">
                                    Get {promo.discountPercentage}% OFF on your
                                    order
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-black text-amber-600">
                                    APPLY
                                  </span>
                                </div>
                              </div>

                              {/* Ticket Cut-outs */}
                              <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-white border border-gray-100 rounded-full -translate-y-1/2 z-20"></div>
                              <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white border border-gray-100 rounded-full -translate-y-1/2 z-20"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                          No offers available right now
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-bold text-gray-800 flex items-center">
                        <BsCurrencyRupee className="text-sm mr-1" />
                        {(
                          getSubtotal() - (appliedPromo?.discountAmount || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Including all taxes and shipping
                    </p>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    Proceed to Checkout
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="bg-white shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-800 mb-4">
                    Secure Shopping
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-blue-50 flex items-center justify-center">
                        <BsTruck className="text-2xl text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-600">
                        Free Shipping Over ₹999
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-green-50 flex items-center justify-center">
                        <BsShieldCheck className="text-2xl text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600">Secure Payment</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-purple-50 flex items-center justify-center">
                        <BsArrowRepeat className="text-2xl text-purple-600" />
                      </div>
                      <p className="text-xs text-gray-600">10-Day Returns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 animate-scaleIn">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center animate-fadeInUp">
              <BsBagCheck className="text-5xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3 animate-slideInLeft">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto animate-slideInLeft">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <button
              onClick={handleContinueShopping}
              className="px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fadeInUp"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>

      {/* Bottom Banner for Cart Page */}
      <Banner page="cart" position="bottom" className="h-40 md:h-52 mt-12" />
    </div>
  );
};

export default Cart;
