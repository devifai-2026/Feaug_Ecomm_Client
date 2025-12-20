import React, { useState, useEffect } from "react";
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

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    name: "Standard Shipping",
    cost: 50,
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
  // Custom color definitions
  const primaryColor = '#C19A6B';
  const primaryLight = '#E8D4B9';
  const primaryDark = '#A07A4B';
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [saveInfo, setSaveInfo] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("standard");

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
  });

  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: "upi",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    saveCard: false,
    saveUpi: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Mock cart data
  const cartItems = [
    { id: 1, title: "Product 1", price: 999, quantity: 1, image: "" },
  ];

  const getSubtotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const subtotal = getSubtotal();
  const selectedShippingOption = SHIPPING_OPTIONS.find(
    (opt) => opt.id === selectedShipping
  );
  const shippingCost = selectedShippingOption?.cost || 0;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCost + tax;

  useEffect(() => {
    if (sameAsShipping) {
      setBillingInfo({
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
    let isValid = false;

    if (currentStep === 1) {
      isValid = await ShippingComponent.validate(shippingInfo);
    } else if (currentStep === 2) {
      const billingValid = sameAsShipping
        ? true
        : await BillingComponent.validate(billingInfo);
      const paymentValid = await PaymentComponent.validate(paymentInfo);
      isValid = billingValid && paymentValid;
    }

    return isValid;
  };

  const handleNextStep = async () => {
    const isValid = await handleStepValidation(step);
    if (isValid) {
      if (step === 1) {
        setBillingInfo({
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

  const showSuccessToast = () => {
    toast.custom(
      (t) => (
        <div
          className={`transform transition-all duration-300 ${
            t.visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl shadow-2xl overflow-hidden border border-green-200 w-96">
            {/* Animated top border */}
            <div 
              className="h-1 animate-pulse"
              style={{ 
                background: `linear-gradient(to right, ${primaryColor}, ${primaryDark})`
              }}
            ></div>

            {/* Close Button */}
            <button
              onClick={() => toast.dismiss(t.id)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-md border border-green-200 hover:border-green-300"
            >
              <BsX className="text-gray-600 hover:text-red-500 text-xl" />
            </button>

            {/* Content */}
            <div className="p-6 text-center pt-8">
              {/* Animated checkmark circle */}
              <div className="mb-4 flex justify-center">
                <div 
                  className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg animate-bounce"
                  style={{ 
                    background: `linear-gradient(to bottom right, ${primaryColor}, ${primaryDark})`
                  }}
                >
                  <BsCheckCircle className="text-5xl text-white" />
                  {/* Floating particles */}
                  <div className="absolute inset-0 rounded-full">
                    <div 
                      className="absolute top-1 right-2 w-2 h-2 rounded-full animate-ping"
                      style={{ backgroundColor: primaryLight }}
                    ></div>
                    <div
                      className="absolute bottom-2 left-3 w-1.5 h-1.5 rounded-full animate-ping"
                      style={{ 
                        backgroundColor: primaryLight,
                        animationDelay: "0.2s"
                      }}
                    ></div>
                    <div
                      className="absolute top-4 left-1 w-1 h-1 rounded-full animate-ping"
                      style={{ 
                        backgroundColor: primaryLight + '80',
                        animationDelay: "0.4s"
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Main heading */}
              <h3 
                className="font-bold text-2xl bg-clip-text text-transparent mb-2"
                style={{ 
                  background: `linear-gradient(to right, ${primaryColor}, ${primaryDark})`,
                  WebkitBackgroundClip: 'text'
                }}
              >
                Order Placed Successfully! 🎉
              </h3>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent mb-4"></div>

              {/* Payment method specific messages */}
              <div className="space-y-2">
                {paymentInfo.method === "cod" && (
                  <div 
                    className="border rounded-lg p-3 animate-slideInUp"
                    style={{ 
                      backgroundColor: primaryLight + '20',
                      borderColor: primaryColor
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <p 
                        className="text-sm font-semibold"
                        style={{ color: primaryDark }}
                      >
                        Keep cash ready for delivery
                      </p>
                    </div>
                    <p className="text-xs mt-2" style={{ color: primaryDark }}>
                      Our delivery partner will contact you soon
                    </p>
                  </div>
                )}

                {paymentInfo.method === "upi" && (
                  <div 
                    className="border rounded-lg p-3 animate-slideInUp"
                    style={{ 
                      backgroundColor: primaryLight + '20',
                      borderColor: primaryColor
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <p 
                        className="text-sm font-semibold"
                        style={{ color: primaryDark }}
                      >
                        Complete payment in your UPI app
                      </p>
                    </div>
                    <p className="text-xs mt-2" style={{ color: primaryDark }}>
                      You'll receive a payment link shortly
                    </p>
                  </div>
                )}

                {paymentInfo.method === "card" && (
                  <div 
                    className="border rounded-lg p-3 animate-slideInUp"
                    style={{ 
                      backgroundColor: primaryLight + '20',
                      borderColor: primaryColor
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <span className="text-white text-xs">💳</span>
                      </div>
                      <p 
                        className="text-sm font-semibold"
                        style={{ color: primaryDark }}
                      >
                        Payment processing in progress
                      </p>
                    </div>
                    <p className="text-xs mt-2" style={{ color: primaryDark }}>
                      Check your email for confirmation
                    </p>
                  </div>
                )}
              </div>

              {/* Footer message */}
              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-xs text-gray-600">
                  📧 Confirmation sent to your email • 🚚 Track your order anytime
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div 
              className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -mr-16 -mt-16"
              style={{ backgroundColor: primaryColor }}
            ></div>
            <div 
              className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10 -ml-12 -mb-12"
              style={{ backgroundColor: primaryDark }}
            ></div>

            <style>{`
              @keyframes slideInUp {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-slideInUp {
                animation: slideInUp 0.6s ease-out;
              }
            `}</style>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
      }
    );
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Save order to localStorage
      const order = {
        orderId: "ORD" + Date.now(),
        date: new Date().toISOString(),
        shippingInfo,
        billingInfo,
        paymentMethod: paymentInfo.method,
        paymentDetails:
          paymentInfo.method === "upi" ? { upiId: paymentInfo.upiId } : {},
        items: cartItems,
        subtotal,
        shippingCost,
        tax,
        total,
        status: paymentInfo.method === "cod" ? "pending" : "processing",
      };

      // Save order history
      const orderHistory = JSON.parse(
        localStorage.getItem("orderHistory") || "[]"
      );
      orderHistory.push(order);
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

      // Show success toast
      showSuccessToast();

      // Reset form after 3 seconds
      setTimeout(() => {
        setStep(1);
        setShippingInfo({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "India",
        });
        setBillingInfo({
          firstName: "",
          lastName: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "India",
        });
        setPaymentInfo({
          method: "upi",
          cardNumber: "",
          cardName: "",
          expiryDate: "",
          cvv: "",
          upiId: "",
          saveCard: false,
          saveUpi: false,
        });
        setErrors({});
        setTouched({});
      }, 3000);
    }, 2000);
  };

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
                <PaymentComponent
                  data={paymentInfo}
                  setData={setPaymentInfo}
                  errors={errors}
                  setErrors={setErrors}
                  touched={touched}
                  setTouched={setTouched}
                  total={total}
                />
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
                      color: 'white'
                    }}
                  >
                    Continue to {step === 1 ? "Payment" : "Review"}
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-8 py-3 font-bold hover:opacity-90 disabled:opacity-50 transition-all"
                    style={{ 
                      backgroundColor: primaryColor,
                      color: 'white'
                    }}
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={subtotal}
              shippingCost={shippingCost}
              tax={tax}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;