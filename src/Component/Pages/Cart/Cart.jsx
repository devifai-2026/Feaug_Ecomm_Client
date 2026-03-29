import React, { useState, useEffect } from "react";
import {
  BsCurrencyRupee,
  BsTrash,
  BsPlus,
  BsDash,
  BsBagCheck,
  BsTruck,
  BsShieldCheck,
  BsArrowRepeat,
  BsTicketPerforated,
} from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
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
    toast.success("Removed from cart");
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
            `'${promo.code}' applied! You saved ₹${discountAmount | 0}`,
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

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      toast.error("Please login to proceed to checkout");
      setTimeout(
        () => navigate(`/login?redirect=${encodeURIComponent("/checkout")}`),
        1000,
      );
      return;
    }

    toast.success("Proceeding to checkout!");
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

  console.log("Cart Items in Cart Page:", cartItems);

  const subtotal = getSubtotal();
  const discount = appliedPromo
    ? (subtotal * appliedPromo.discountPercentage) / 100
    : 0;
  const total = subtotal - discount;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <Banner page="cart" position="top" className="h-32 md:h-40" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
              Shopping Cart
            </h1>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-3">
            {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
          </p>
          <div className="w-12 h-0.5 bg-[#C19A6B]"></div>
        </div>

        {cartItems && cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left - Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex gap-4 md:gap-6 p-4 border border-gray-100 hover:border-[#C19A6B]/20 transition-colors"
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-gray-50 overflow-hidden">
                    <img
                      src={item.image || "/placeholder-image.jpg"}
                      alt={item.title || "Product"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-2">
                        {item.title || "Unnamed Product"}
                      </h3>
                      <button
                        onClick={(e) => handleRemoveItem(item, e)}
                        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <BsTrash className="text-sm" />
                      </button>
                    </div>

                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1 hidden md:block">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-[#C19A6B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <BsDash className="text-sm text-gray-600" />
                        </button>

                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          className="w-12 h-8 border-t border-b border-gray-200 text-center text-sm text-gray-800 font-medium focus:outline-none"
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
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-[#C19A6B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <BsPlus className="text-sm text-gray-600" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-base font-semibold text-gray-900 flex items-center sm:justify-end">
                          <BsCurrencyRupee className="text-xs" />
                          {calculateItemTotal(item) | 0}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-xs text-gray-400">
                            {item.quantity} x ₹{item.price || 0}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Link */}
              <button
                onClick={handleContinueShopping}
                className="text-sm text-[#C19A6B] hover:text-[#a8845a] font-medium mt-2 transition-colors"
              >
                &larr; Continue Shopping
              </button>
            </div>

            {/* Right - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Order Summary
                  </h2>
                  <div className="w-8 h-0.5 bg-[#C19A6B] mb-5"></div>

                  {/* Price Lines */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-800 font-medium flex items-center">
                        <BsCurrencyRupee className="text-xs" />
                        {subtotal | 0}
                      </span>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center gap-1">
                          Discount ({appliedPromo.code})
                          <button
                            onClick={handleRemovePromo}
                            className="text-red-400 hover:text-red-500 text-xs underline"
                          >
                            remove
                          </button>
                        </span>
                        <span className="font-medium flex items-center">
                          -<BsCurrencyRupee className="text-xs" />
                          {discount | 0}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-gray-800 font-medium text-xs">
                        Included
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax</span>
                      <span className="text-gray-800 font-medium text-xs">
                        Included
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-100 mt-4 pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-semibold text-gray-900 flex items-center text-lg">
                        <BsCurrencyRupee className="text-sm" />
                        {total | 0}
                      </span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <BsTicketPerforated className="text-sm text-[#C19A6B]" />
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Promo Code
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-gray-200 text-sm focus:border-[#C19A6B] focus:outline-none uppercase font-medium placeholder:normal-case placeholder:font-normal"
                      />
                      <button
                        onClick={() => handleApplyPromo()}
                        disabled={isApplyingPromo}
                        className="px-4 py-2 bg-gray-900 text-white text-xs font-medium uppercase hover:bg-black transition-colors disabled:opacity-50"
                      >
                        {isApplyingPromo ? "..." : "Apply"}
                      </button>
                    </div>

                    {/* Available Promos */}
                    {availablePromos.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                          Available Offers
                        </p>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto">
                          {availablePromos.map((promo) => (
                            <button
                              key={promo._id}
                              onClick={() => {
                                if (appliedPromo?.code !== promo.code) {
                                  handleApplyPromo(promo.code);
                                }
                              }}
                              className={`w-full text-left px-3 py-2 border text-xs transition-colors ${
                                appliedPromo?.code === promo.code
                                  ? "border-[#C19A6B]/40 bg-[#C19A6B]/5"
                                  : "border-gray-100 hover:border-[#C19A6B]/30"
                              }`}
                            >
                              <div>
                                <span className="font-semibold text-gray-800">
                                  {promo.code}
                                </span>
                                <span className="text-gray-500 ml-2">
                                  {promo.discountPercentage}% off
                                </span>
                              </div>
                              {(promo.minimumPurchase > 0 || promo.applicableCategory || promo.firstTimeOnly) && (
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {promo.minimumPurchase > 0 && (
                                    <span className="text-[10px] text-gray-400">
                                      Min. order ₹{promo.minimumPurchase}
                                    </span>
                                  )}
                                  {promo.applicableCategory && (
                                    <span className="text-[10px] text-gray-400">
                                      {promo.minimumPurchase > 0 && " · "}Valid on {promo.applicableCategoryName || promo.applicableCategory}
                                    </span>
                                  )}
                                  {promo.firstTimeOnly && (
                                    <span className="text-[10px] text-gray-400">
                                      {(promo.minimumPurchase > 0 || promo.applicableCategory) && " · "}First order only
                                    </span>
                                  )}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full mt-6 py-3 bg-[#C19A6B] text-white font-medium text-sm hover:bg-[#a8845a] transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 text-center py-4">
                  <div>
                    <BsTruck className="text-lg text-[#C19A6B] mx-auto mb-1.5" />
                    <p className="text-[10px] text-gray-500 leading-tight">
                      Free Shipping
                      <br />
                      Over ₹999
                    </p>
                  </div>
                  <div>
                    <BsShieldCheck className="text-lg text-[#C19A6B] mx-auto mb-1.5" />
                    <p className="text-[10px] text-gray-500 leading-tight">
                      Secure
                      <br />
                      Payment
                    </p>
                  </div>
                  <div>
                    <BsArrowRepeat className="text-lg text-[#C19A6B] mx-auto mb-1.5" />
                    <p className="text-[10px] text-gray-500 leading-tight">
                      Easy
                      <br />
                      Returns
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart */
          <div className="text-center py-20">
            <BsBagCheck className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Your cart is empty
            </h3>
            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
              Discover our curated collection and find something you love.
            </p>
            <button
              onClick={handleContinueShopping}
              className="px-8 py-2.5 bg-[#C19A6B] text-white text-sm font-medium hover:bg-[#a8845a] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* Bottom Banner */}
      <Banner page="cart" position="bottom" className="h-40 md:h-52 mt-12" />
    </div>
  );
};

export default Cart;
