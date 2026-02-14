import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsCurrencyRupee,
  BsArrowLeft,
  BsCreditCard,
  BsTruck,
  BsShieldCheck,
  BsLock,
  BsCheckCircle,
  BsCash,
  BsExclamationCircle,
  BsPhone,
  BsX,
} from "react-icons/bs";
import { toast, Toaster } from "react-hot-toast";
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
  INDIAN_STATES,
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
  const { cartItems, getCartTotal, clearCart, appliedPromo } = useCart();

  // Custom color definitions
  const primaryColor = "#C19A6B";
  const primaryLight = "#E8D4B9";
  const primaryDark = "#A07A4B";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stockChecking, setStockChecking] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [saveInfo, setSaveInfo] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [userAddresses, setUserAddresses] = useState([]);
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

  // Check authentication and fetch latest user data
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

          // Fetch paginated addresses
          await fetchPaginatedAddresses(1);

          // Find default or first address
          const defaultAddr =
            user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
          setShippingInfo((prev) => ({
            ...prev,
            _id: defaultAddr?._id || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            address: defaultAddr
              ? `${defaultAddr.addressLine1 || defaultAddr.address || ""}${defaultAddr.addressLine2 || defaultAddr.landmark ? ", " + (defaultAddr.addressLine2 || defaultAddr.landmark) : ""}`
              : "",
            city: defaultAddr?.city || "",
            state: defaultAddr?.state || "",
            zipCode: defaultAddr?.pincode || "",
            country: defaultAddr?.country || "India",
          }));
        } else {
          // Fallback to stored user
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

        // If current page is empty and we're not on page 1, go to previous page
        if (response.data.addresses.length === 0 && page > 1) {
          setAddressPage(page - 1);
        }

        return formattedAddresses;
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
    return null;
  };

  const refreshAddresses = async () => {
    return await fetchPaginatedAddresses(addressPage);
  };

  useEffect(() => {
    if (step === 1 && userApi.isAuthenticated()) {
      fetchPaginatedAddresses(addressPage);
    }
  }, [addressPage, step]);

  // Check stock availability
  useEffect(() => {
    if (cartItems.length > 0 && userApi.isAuthenticated()) {
      setStockChecking(true);
      cartApi.checkCartStock({
        setLoading: setStockChecking,
        onSuccess: (data) => {
          if (!data.success || data.data?.outOfStock?.length > 0) {
            toast.error(
              "Some items in your cart are out of stock. Please update your cart.",
            );
          }
        },
        onError: () => {
          // Silently fail stock check
        },
      });
    }
  }, [cartItems]);

  // Calculate totals
  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.price || item.sellingPrice || 0;
      return sum + price * (item.quantity || 1);
    }, 0);
  };

  const subtotal = getSubtotal();
  const selectedShippingOption = SHIPPING_OPTIONS.find(
    (opt) => opt.id === selectedShipping,
  );
  const shippingCost = selectedShippingOption?.cost || 0;

  const discountAmount = appliedPromo
    ? appliedPromo.discountAmount ||
      (subtotal * appliedPromo.discountPercentage) / 100
    : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  const tax = Math.round(discountedSubtotal * 0.03); // 3% GST on discounted subtotal
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
      const fields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "zipCode",
      ];
      fields.forEach((field) => {
        newTouched[field] = true;
        const error = validateShippingField(
          field,
          shippingInfo[field],
          shippingInfo,
        );
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    } else if (currentStep === 2) {
      // Validate Billing
      if (!sameAsShipping) {
        const billingFields = [
          "firstName",
          "lastName",
          "address",
          "city",
          "state",
          "zipCode",
        ];
        billingFields.forEach((field) => {
          newTouched[field] = true;
          const error = validateBillingField(
            field,
            billingInfo[field],
            billingInfo,
          );
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });
      }

      // Validate Payment
      const paymentFields = ["method"]; // Basic check
      if (paymentInfo.method === "online") {
        if (paymentInfo.onlineType === "card") {
          ["cardNumber", "cardName", "expiryDate", "cvv"].forEach((field) => {
            newTouched[field] = true;
            const error = validatePaymentField(
              field,
              paymentInfo[field],
              "card",
            );
            if (error) {
              newErrors[field] = error;
              isValid = false;
            }
          });
        } else if (paymentInfo.onlineType === "upi") {
          newTouched["upiId"] = true;
          const error = validatePaymentField("upiId", paymentInfo.upiId, "upi");
          if (error) {
            newErrors["upiId"] = error;
            isValid = false;
          }
        }
      }
    }

    setErrors(newErrors);
    setTouched((prev) => ({ ...prev, ...newTouched }));
    return isValid;
  };

  const handleNextStep = async () => {
    const isValid = await handleStepValidation(step);
    if (isValid) {
      if (step === 1) {
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
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (orderData) => {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error("Failed to load payment gateway. Please try again.");
      return null;
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: env.RAZORPAY_KEY_ID || "rzp_test_1234567890",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Feauage Jewelry",
        description: `Order #${orderData.orderId}`,
        order_id: orderData.razorpayOrderId,
        customer_id: orderData.razorpayCustomerId,
        handler: function (response) {
          resolve({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
        prefill: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        theme: {
          color: primaryColor,
        },
        modal: {
          ondismiss: function () {
            reject(new Error("Payment cancelled by user"));
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        reject(new Error(response.error.description || "Payment failed"));
      });
      razorpay.open();
    });
  };

  // Handle 3DS redirect in popup for S2S card payments
  const handleS2SRedirect = (redirectUrl, orderId) => {
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(
      redirectUrl,
      "razorpay_3ds",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`,
    );

    if (!popup) {
      toast.error("Popup blocked. Redirecting to bank verification...");
      window.location.href = redirectUrl;
      return;
    }

    // Poll for popup closure
    const pollInterval = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(pollInterval);
          checkPaymentStatus(orderId);
        }
      } catch (e) {
        // Cross-origin access error expected while popup is on bank page
      }
    }, 1000);

    // Safety timeout - stop polling after 10 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (!popup.closed) popup.close();
      checkPaymentStatus(orderId);
    }, 600000);
  };

  // Check payment status after 3DS redirect
  const checkPaymentStatus = (orderId) => {
    paymentApi.getPaymentStatus({
      orderId,
      onSuccess: (data) => {
        if (data.success && data.data?.paymentStatus === "paid") {
          showSuccessToast(orderId);
          setTimeout(() => navigate("/myOrders"), 3000);
        } else if (data.data?.paymentStatus === "failed") {
          toast.error("Payment failed. Please try again from My Orders.");
          setTimeout(() => navigate("/myOrders"), 2000);
        } else {
          navigate(`/payment-status?status=pending&orderId=${orderId}`);
        }
      },
      onError: () => {
        navigate(`/payment-status?status=pending&orderId=${orderId}`);
      },
    });
  };

  const showSuccessToast = (orderId) => {
    toast.custom(
      (t) => (
        <div
          className={`transform transition-all duration-300 ${
            t.visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl shadow-2xl overflow-hidden border border-green-200 w-96">
            <div
              className="h-1 animate-pulse"
              style={{
                background: `linear-gradient(to right, ${primaryColor}, ${primaryDark})`,
              }}
            ></div>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-md border border-green-200 hover:border-green-300"
            >
              <BsX className="text-gray-600 hover:text-red-500 text-xl" />
            </button>

            <div className="p-6 text-center pt-8">
              <div className="mb-4 flex justify-center">
                <div
                  className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg animate-bounce"
                  style={{
                    background: `linear-gradient(to bottom right, ${primaryColor}, ${primaryDark})`,
                  }}
                >
                  <BsCheckCircle className="text-5xl text-white" />
                </div>
              </div>

              <h3
                className="font-bold text-2xl mb-2"
                style={{
                  background: `linear-gradient(to right, ${primaryColor}, ${primaryDark})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Order Placed Successfully!
              </h3>

              {orderId && (
                <p className="text-gray-600 mb-2">Order ID: {orderId}</p>
              )}

              <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent mb-4"></div>

              <div className="space-y-2">
                {paymentInfo.method === "cod" && (
                  <div
                    className="border rounded-lg p-3"
                    style={{
                      backgroundColor: primaryLight + "20",
                      borderColor: primaryColor,
                    }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{ color: primaryDark }}
                    >
                      Keep cash ready for delivery
                    </p>
                  </div>
                )}

                {paymentInfo.method === "online" && (
                  <div
                    className="border rounded-lg p-3"
                    style={{
                      backgroundColor: primaryLight + "20",
                      borderColor: primaryColor,
                    }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{ color: primaryDark }}
                    >
                      Payment confirmed successfully!
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-green-200">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    navigate("/myOrders");
                  }}
                  className="px-6 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: primaryColor }}
                >
                  View My Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 8000,
        position: "top-center",
      },
    );
  };

  const handlePlaceOrder = async () => {
    if (!userApi.isAuthenticated()) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // 1) Ensure we have valid addresses with IDs
      let finalShippingId = shippingInfo._id || shippingInfo.id;
      let finalBillingId = billingInfo._id || billingInfo.id || finalShippingId;

      // If no shipping ID (i.e., user entered new address but didn't click "Save")
      if (!finalShippingId) {
        // Validate shipping info before attempting to save
        const requiredFields = [
          "firstName",
          "lastName",
          "phone",
          "address",
          "city",
          "state",
          "zipCode",
        ];
        const validationErrors = {};

        requiredFields.forEach((field) => {
          const error = validateShippingField(
            field,
            shippingInfo[field],
            shippingInfo,
          );
          if (error) {
            validationErrors[field] = error;
          }
        });

        if (Object.keys(validationErrors).length > 0) {
          // Show first error message
          const firstError = Object.values(validationErrors)[0];
          toast.error(
            firstError ||
              "Please fill in all required address fields correctly",
          );
          setLoading(false);
          setStep(1); // Go back to shipping step
          return;
        }

        try {
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
          if (saveResponse.status === "success" && saveResponse.data) {
            // Backend might return the user with addresses or just the new address
            const user = saveResponse.data.user || saveResponse.data;
            const newAddr = user.addresses
              ? user.addresses[user.addresses.length - 1]
              : user;
            finalShippingId = newAddr._id || newAddr.id;
            if (!finalBillingId) finalBillingId = finalShippingId;

            // Update local state so UI reflects it was saved
            setShippingInfo((prev) => ({ ...prev, _id: finalShippingId }));
            await refreshAddresses();
          } else {
            throw new Error(saveResponse.message || "Failed to save address");
          }
        } catch (err) {
          console.error("Failed to auto-save address during checkout:", err);
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Please provide a valid address";
          toast.error(errorMessage);
          setLoading(false);
          return;
        }
      }

      // Final check
      if (!finalShippingId) {
        toast.error("Shipping address is required");
        setLoading(false);
        return;
      }

      // Prepare order data
      const orderData = {
        shippingAddressId: finalShippingId,
        billingAddressId: finalBillingId,
        shippingMethod: selectedShipping,
        paymentMethod: paymentInfo.method === "cod" ? "cod" : "razorpay",
        promoCode: appliedPromo?.code,
      };

      // Case 1: COD - Create order immediately
      if (paymentInfo.method === "cod") {
        orderApi.createOrder({
          orderData,
          setLoading,
          onSuccess: (data) => {
            if (data.success && data.data) {
              const order = data.data.order || data.data;
              clearCart();
              showSuccessToast(order.orderId || order._id);
              setTimeout(() => navigate("/myOrders"), 3000);
            } else {
              toast.error(data.message || "Failed to create order");
            }
          },
          onError: (err) => {
            const errorMessage = err.message || "Failed to create order.";
            toast.error(errorMessage);
          },
        });
        return;
      }

      // Case 2: Online Payment (Razorpay Modal)
      // NEW FLOW: Initiate -> Pay (via Modal) -> Create (Finalize)
      orderApi.initiatePayment({
        orderData,
        setLoading,
        onSuccess: async (initData) => {
          if (initData.success && initData.data?.razorpayOrder) {
            const rzpOrder = initData.data.razorpayOrder;

            try {
              // Open Razorpay Modal
              const paymentResult = await handleRazorpayPayment({
                orderId: "New Order",
                razorpayOrderId: rzpOrder.id,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                razorpayCustomerId: initData.data.razorpayCustomerId,
              });

              if (paymentResult) {
                // Now hit the POST /api/v1/orders with payment proof
                orderApi.createOrder({
                  orderData: {
                    ...orderData,
                    razorpayPaymentId: paymentResult.razorpayPaymentId,
                    razorpayOrderId: paymentResult.razorpayOrderId,
                    razorpaySignature: paymentResult.razorpaySignature,
                  },
                  setLoading,
                  onSuccess: (finalData) => {
                    const finalOrder = finalData.data.order || finalData.data;
                    clearCart();
                    showSuccessToast(finalOrder.orderId || finalOrder._id);
                    setTimeout(() => navigate("/myOrders"), 3000);
                  },
                  onError: (err) => {
                    toast.error(
                      "Payment successful but order creation failed. Please contact support.",
                    );
                  },
                });
              }
            } catch (err) {
              toast.error(err.message || "Payment cancelled");
            }
          } else {
            toast.error("Failed to initiate payment gateway");
          }
        },
        onError: (err) => {
          toast.error(err.message || "Failed to initiate payment");
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <Toaster position="top-center" />
        <div className="max-w-6xl mx-auto text-center">
          <BsCreditCard
            className="text-6xl mx-auto mb-6"
            style={{ color: primaryColor }}
          />
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            Your cart is empty
          </h3>
          <p className="text-gray-600 mb-8">
            Add items to your cart before checking out.
          </p>
          <button
            onClick={() => navigate("/categories")}
            className="px-8 py-3 text-white font-bold rounded-lg"
            style={{ backgroundColor: primaryColor }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto mb-12">
        <ProgressSteps currentStep={step} />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <ShippingComponent
                data={shippingInfo}
                setData={setShippingInfo}
                errors={errors}
                setErrors={setErrors}
                touched={touched}
                setTouched={setTouched}
                saveInfo={saveInfo}
                setSaveInfo={setSaveInfo}
                savedAddresses={userAddresses}
                refreshAddresses={refreshAddresses}
                page={addressPage}
                totalPages={totalPages}
                totalAddresses={totalAddresses}
                onPageChange={setAddressPage}
              />
            )}

            {step === 2 && (
              <>
                <BillingComponent
                  data={billingInfo}
                  setData={setBillingInfo}
                  sameAsShipping={sameAsShipping}
                  setSameAsShipping={setSameAsShipping}
                  errors={errors}
                  setErrors={setErrors}
                  touched={touched}
                  setTouched={setTouched}
                />

                <div className="mt-8">
                  <PaymentComponent
                    data={paymentInfo}
                    setData={setPaymentInfo}
                    total={total}
                    errors={errors}
                    touched={touched}
                    setErrors={setErrors}
                    setTouched={setTouched}
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <ReviewComponent
                shippingInfo={shippingInfo}
                billingInfo={billingInfo}
                paymentInfo={paymentInfo}
                cartItems={cartItems}
                selectedShippingOption={selectedShippingOption}
                subtotal={subtotal}
                shippingCost={shippingCost}
                tax={tax}
                total={total}
                discountAmount={discountAmount}
                appliedPromo={appliedPromo}
              />
            )}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                >
                  <BsArrowLeft className="inline mr-2" /> Previous
                </button>
              )}

              <div className="ml-auto">
                {step < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-8 py-3 font-bold hover:opacity-90 transition-all"
                    style={{
                      backgroundColor: primaryColor,
                      color: "white",
                    }}
                  >
                    Continue to {step === 1 ? "Payment" : "Review"}
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || stockChecking}
                    className="px-8 py-3 font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                    style={{
                      backgroundColor: primaryColor,
                      color: "white",
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <BsLock />
                        Place Order - {formatPrice(total)}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shippingCost={shippingCost}
              tax={tax}
              total={total}
              discountAmount={discountAmount}
              appliedPromo={appliedPromo}
              selectedShipping={selectedShipping}
              setSelectedShipping={setSelectedShipping}
              shippingOptions={SHIPPING_OPTIONS}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format price
const formatPrice = (price) => {
  return `₹${price.toLocaleString("en-IN")}`;
};

export default Checkout;
