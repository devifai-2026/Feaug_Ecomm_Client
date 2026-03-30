import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsArrowLeft,
  BsShieldCheck,
  BsLock,
} from "react-icons/bs";
import toast from "react-hot-toast";
import { ProgressSteps } from "./ProgressSteps";
import ShippingComponent from "./ShippingComponent";
import BillingComponent from "./BillingComponent";
import PaymentComponent from "./PaymentComponent";
import { ReviewComponent } from "./ReviewComponent";
import { OrderSummary } from "./OrderSummary";
import { useCart } from "../../Context/CartContext";
import orderApi from "../../../apis/orderApi";
import cartApi from "../../../apis/cartApi";
import paymentApi from "../../../apis/paymentApi";
import userApi from "../../../apis/user/userApi";
import { env } from "../../../environments";
import {
  validateShippingField,
  validateBillingField,
  validatePaymentField,
} from "../../utils/Validation";

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    name: "Standard Shipping",
    cost: 0,
    days: "5-7 business days",
  },
  {
    id: "express",
    name: "Express Shipping",
    cost: 150,
    days: "2-3 business days",
  },
  {
    id: "nextDay",
    name: "Next Day Delivery",
    cost: 300,
    days: "1 business day",
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, appliedPromo } = useCart();

  const primaryColor = "#C19A6B";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stockChecking, setStockChecking] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [saveInfo, setSaveInfo] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [userAddresses, setUserAddresses] = useState([]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);
  const [addressPage, setAddressPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalAddresses, setTotalAddresses] = useState(0);
  const ADDRESSES_PER_PAGE = 4;

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    _id: "",
  });

  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    _id: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: "online",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const initCheckout = async () => {
      if (!userApi.isAuthenticated()) {
        toast.error("Please login to checkout");
        navigate("/login?redirect=/checkout");
        return;
      }

      setLoading(true);
      try {
        const response = await userApi.getCurrentUser();
        if (response.status === "success" && response.data) {
          const user = response.data.user || response.data;
          await fetchPaginatedAddresses(1);
          const defaultAddr = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
          setShippingInfo((prev) => ({
            ...prev,
            _id: defaultAddr?._id || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            address: defaultAddr ? `${defaultAddr.addressLine1 || defaultAddr.address || ""}${defaultAddr.addressLine2 || defaultAddr.landmark ? ", " + (defaultAddr.addressLine2 || defaultAddr.landmark) : ""}` : "",
            city: defaultAddr?.city || "",
            state: defaultAddr?.state || "",
            zipCode: defaultAddr?.pincode || "",
            country: defaultAddr?.country || "India",
          }));
        } else {
          const user = userApi.getStoredUser();
          if (user) {
            setShippingInfo((prev) => ({
              ...prev,
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              email: user.email || "",
              phone: user.phone || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user data for checkout:", error);
      } finally {
        setLoading(false);
      }
    };
    initCheckout();
  }, [navigate]);

  const fetchPaginatedAddresses = async (page) => {
    try {
      const response = await userApi.getAddresses(page, ADDRESSES_PER_PAGE);
      if (response.status === "success") {
        const user = userApi.getStoredUser();
        const formattedAddresses = response.data.addresses.map((addr) => ({
          id: addr._id || addr.id,
          _id: addr._id || addr.id,
          firstName: addr.name?.split(" ")[0] || user?.firstName || "",
          lastName: addr.name?.split(" ")[1] || user?.lastName || "",
          email: addr.email || user?.email || "",
          phone: addr.phone || user?.phone || "",
          address: addr.address || addr.addressLine1,
          addressLine1: addr.addressLine1,
          addressLine2: addr.addressLine2,
          city: addr.city,
          state: addr.state,
          zipCode: addr.pincode,
          country: addr.country,
          isDefault: addr.isDefault,
          type: addr.addressType || addr.type,
          label: addr.addressType || addr.type,
        }));
        setUserAddresses(formattedAddresses);
        setTotalPages(response.totalPages);
        setTotalAddresses(response.total);
        setAddressPage(response.page);
        return formattedAddresses;
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
    return null;
  };

  const refreshAddresses = async () => await fetchPaginatedAddresses(addressPage);

  useEffect(() => {
    if (step === 1 && userApi.isAuthenticated()) {
      fetchPaginatedAddresses(addressPage);
    }
  }, [addressPage, step]);

  useEffect(() => {
    if (cartItems.length > 0 && userApi.isAuthenticated()) {
      setStockChecking(true);
      cartApi.checkCartStock({
        setLoading: setStockChecking,
        onSuccess: (data) => {
          if (!data.success || data.data?.outOfStock?.length > 0) {
            toast.error("Some items in your cart are out of stock. Please update your cart.");
          }
        },
        onError: () => {},
      });
    }
  }, [cartItems]);

  const getSubtotal = () => cartItems.reduce((sum, item) => {
    const price = item.price || item.sellingPrice || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const subtotal = getSubtotal();
  const selectedShippingOption = SHIPPING_OPTIONS.find((opt) => opt.id === selectedShipping);
  const shippingCost = selectedShippingOption?.cost || 0;

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    const percentage = parseFloat(appliedPromo.discountPercentage);
    if (!isNaN(percentage)) return (subtotal * percentage) / 100;
    return 0;
  }, [appliedPromo, subtotal]);

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(discountedSubtotal * 0.03); 
  const total = discountedSubtotal + shippingCost + tax;

  useEffect(() => {
    if (sameAsShipping) {
      setBillingInfo({
        _id: shippingInfo._id,
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
        country: shippingInfo.country,
      });
    }
  }, [sameAsShipping, shippingInfo]);

  const handleStepValidation = async (currentStep) => {
    let isValid = true;
    const newErrors = {};
    const newTouched = {};
    if (currentStep === 1) {
      ["firstName", "lastName", "email", "phone"].forEach((field) => {
        newTouched[field] = true;
        const error = validateShippingField(field, shippingInfo[field], shippingInfo);
        if (error) { newErrors[field] = error; isValid = false; }
      });
    } else if (currentStep === 2) {
      if (!sameAsShipping) {
        ["firstName", "lastName", "address", "city", "state", "zipCode"].forEach((field) => {
          newTouched[field] = true;
          const error = validateBillingField(field, billingInfo[field], billingInfo);
          if (error) { newErrors[field] = error; isValid = false; }
        });
      }
    }
    setErrors(newErrors);
    setTouched((prev) => ({ ...prev, ...newTouched }));
    return isValid;
  };

  const handleNextStep = async () => {
    if (await handleStepValidation(step)) {
      if (step === 1) {
        setBillingInfo({ ...shippingInfo });
        const pincode = shippingInfo.zipCode?.replace(/\D/g, '');
        if (pincode && pincode.length === 6) {
          setLoading(true);
          try {
            await new Promise((resolve, reject) => {
              orderApi.checkServiceability({
                pincode,
                setLoading: null,
                onSuccess: (data) => {
                  if (data?.data && data.data.deliverable === false && !data.data.error) {
                    reject(new Error(`Sorry, we don't deliver to pincode ${pincode} yet.`));
                  } else resolve();
                },
                onError: () => resolve(),
              });
            });
          } catch (err) {
            toast.error(err.message);
            setErrors((prev) => ({ ...prev, zipCode: 'Delivery not available' }));
            setLoading(false);
            return;
          } finally { setLoading(false); }
        }
      }
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else toast.error("Please fix errors before continuing");
  };

  const handlePrevStep = () => { if (step > 1) { setStep(step - 1); window.scrollTo(0, 0); } };

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleRazorpayPayment = async (orderData) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) { toast.error("Failed to load payment gateway."); return null; }
    return new Promise((resolve, reject) => {
      const options = {
        key: env.RAZORPAY_KEY_ID || "rzp_test_1234567890",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Feauage Jewelry",
        description: `Order #${orderData.orderId}`,
        order_id: orderData.razorpayOrderId,
        customer_id: orderData.razorpayCustomerId,
        handler: (response) => resolve({
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        }),
        prefill: { name: `${shippingInfo.firstName} ${shippingInfo.lastName}`, email: shippingInfo.email, contact: shippingInfo.phone },
        theme: { color: primaryColor },
        modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => reject(new Error(response.error.description || "Payment failed")));
      razorpay.open();
    });
  };

  const showSuccessToast = (orderId) => toast.success(orderId ? `Order placed! ID: ${orderId}` : 'Order placed successfully!', { duration: 5000 });

  const handlePlaceOrder = async () => {
    if (!userApi.isAuthenticated()) { navigate("/login"); return; }
    setLoading(true);
    try {
      let finalShippingId = shippingInfo._id || shippingInfo.id;
      if (!finalShippingId) {
        const addressPayload = {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          addressLine1: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.zipCode,
          country: shippingInfo.country || "India",
          addressType: "home",
        };
        const saveResponse = await userApi.addAddress(addressPayload);
        if (saveResponse.status === "success") {
          const user = saveResponse.data.user || saveResponse.data;
          finalShippingId = (user.addresses ? user.addresses[user.addresses.length - 1] : user)._id;
          setShippingInfo((prev) => ({ ...prev, _id: finalShippingId }));
          await refreshAddresses();
        } else throw new Error(saveResponse.message || "Failed to save address");
      }

      const orderData = {
        shippingAddressId: finalShippingId,
        billingAddressId: billingInfo._id || billingInfo.id || finalShippingId,
        shippingMethod: selectedShipping,
        paymentMethod: "razorpay",
        promoCode: appliedPromo?.code,
      };

      orderApi.initiatePayment({
        orderData,
        setLoading: null,
        onSuccess: async (initData) => {
          if ((initData.status === 'success' || initData.success) && initData.data?.razorpayOrder) {
            const rzpOrder = initData.data.razorpayOrder;
            try {
              const paymentResult = await handleRazorpayPayment({
                orderId: "New Order",
                razorpayOrderId: rzpOrder.id,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                razorpayCustomerId: initData.data.razorpayCustomerId,
              });
              if (paymentResult) {
                orderApi.createOrder({
                  orderData: { ...orderData, ...paymentResult },
                  setLoading,
                  onSuccess: (finalData) => {
                    const finalOrder = finalData.data.order || finalData.data;
                    clearCart();
                    showSuccessToast(finalOrder.orderId || finalOrder._id);
                    setTimeout(() => navigate("/myOrders"), 1500);
                  },
                  onError: () => { toast.error("Order creation failed. Contact support."); setLoading(false); },
                });
              } else setLoading(false);
            } catch (err) { toast.error(err.message || "Payment cancelled"); setLoading(false); }
          } else { toast.error("Failed to initiate payment gateway"); setLoading(false); }
        },
        onError: (err) => { toast.error(err.data?.message || err.message || "Failed to initiate payment"); setLoading(false); },
      });
    } catch (error) { toast.error("An error occurred."); setLoading(false); }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white py-24 px-4 flex flex-col items-center justify-center">
        <h3 className="text-3xl font-medium text-gray-900 mb-6 italic">Your cart is currently empty</h3>
        <button onClick={() => navigate("/categories")} className="px-12 py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#C19A6B] transition-all">
          Explore Boutique
        </button>
      </div>
    );
  }

  const formatPrice = (price) => `₹${price.toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Header */}
      <div className="border-b border-gray-100 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-7xl font-light tracking-tight text-gray-900">
                Checkout <span className="italic text-[#C19A6B]">Journey</span>
              </h1>
              <p className="text-[10px] text-[#C19A6B] mt-6 font-bold uppercase tracking-[0.4em]">
                Step {step} of 3 — {step === 1 ? 'Shipping' : step === 2 ? 'Payment' : 'Review'}
              </p>
            </div>
            <button onClick={() => navigate("/cart")} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors">
              [ Return to Bag ]
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-24">
          <ProgressSteps currentStep={step} />
        </div>

        <div className="grid lg:grid-cols-12 gap-24 items-start">
          <div className="lg:col-span-8 space-y-20">
            <div className="bg-white">
              {step === 1 && (
                <ShippingComponent
                  data={shippingInfo} setData={setShippingInfo}
                  errors={errors} setErrors={setErrors}
                  touched={touched} setTouched={setTouched}
                  saveInfo={saveInfo} setSaveInfo={setSaveInfo}
                  savedAddresses={userAddresses} refreshAddresses={refreshAddresses}
                  page={addressPage} totalPages={totalPages} totalAddresses={totalAddresses}
                  onPageChange={setAddressPage}
                />
              )}

              {step === 2 && (
                <div className="space-y-16">
                  <BillingComponent
                    data={billingInfo} setData={setBillingInfo}
                    sameAsShipping={sameAsShipping} setSameAsShipping={setSameAsShipping}
                    errors={errors} setErrors={setErrors}
                    touched={touched} setTouched={setTouched}
                  />
                  <div className="pt-16 border-t border-gray-100">
                    <PaymentComponent
                      data={paymentInfo} setData={setPaymentInfo}
                      total={total} errors={errors}
                      touched={touched} setErrors={setErrors}
                      setTouched={setTouched}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <ReviewComponent
                  shippingInfo={shippingInfo} billingInfo={billingInfo}
                  paymentInfo={paymentInfo} cartItems={cartItems}
                  selectedShippingOption={selectedShippingOption}
                  subtotal={subtotal} shippingCost={shippingCost}
                  tax={tax} total={total}
                  discountAmount={discountAmount} appliedPromo={appliedPromo}
                />
              )}

              <div className="mt-24 flex flex-col sm:flex-row items-center justify-between gap-10 pt-12 border-t border-gray-200">
                {step > 1 ? (
                  <button onClick={handlePrevStep} className="w-full sm:w-auto px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-100 hover:border-gray-900 hover:text-gray-900 transition-all">
                    Previous Phase
                  </button>
                ) : <div className="hidden sm:block"></div>}

                {step < 3 ? (
                  <button onClick={handleNextStep} disabled={loading} className="w-full sm:w-auto px-12 py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#C19A6B] transition-all disabled:opacity-50 shadow-2xl flex items-center justify-center gap-3">
                    {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                    Proceed to {step === 1 ? "Payment" : "Final Review"}
                  </button>
                ) : (
                  <button onClick={handlePlaceOrder} disabled={loading || stockChecking} className="w-full sm:w-auto px-12 py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#C19A6B] transition-all disabled:opacity-50 shadow-2xl flex items-center justify-center gap-4">
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <BsShieldCheck className="text-sm" />}
                    Confirm Secure Purchase — {formatPrice(total)}
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-12 border-y border-gray-50">
               <div className="flex items-center gap-4 text-gray-300 group hover:text-gray-900 transition-colors">
                 <BsLock className="text-xl" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Safe Encryption</span>
               </div>
               <div className="flex items-center gap-4 text-gray-300 group hover:text-[#C19A6B] transition-colors">
                 <BsShieldCheck className="text-xl" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Authentic Verified</span>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 sticky top-12">
            <OrderSummary
              cartItems={cartItems} subtotal={subtotal}
              shippingCost={shippingCost} tax={tax} total={total}
              discountAmount={discountAmount} appliedPromo={appliedPromo}
              selectedShipping={selectedShipping} setSelectedShipping={setSelectedShipping}
              shippingOptions={SHIPPING_OPTIONS}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
