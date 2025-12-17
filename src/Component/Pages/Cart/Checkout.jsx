// Component/Pages/Cart/Checkout.jsx
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
} from "react-icons/bs";
import { BsX } from "react-icons/bs";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaQrcode } from "react-icons/fa";
import { RiSecurePaymentLine, RiBankLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import ShippingComponent from "./ShippingComponent";
import BillingComponent from "./BillingComponent";
import PaymentComponent from "./PaymentComponent";
import ReviewComponent from "./ReviewComponent";

// Move InputField component outside
const InputField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  error,
  id,
  required = true,
  className = "",
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && "*"}
    </label>
    <div className="relative">
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50"
            : "border-gray-300 focus:border-amber-500 focus:ring-amber-500 hover:border-gray-400"
        }`}
        placeholder={placeholder}
      />
      {error && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <BsExclamationCircle className="text-red-500" />
        </div>
      )}
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <BsExclamationCircle className="text-xs" />
        {error}
      </p>
    )}
  </div>
);

// Move TextareaField component outside
const TextareaField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  id,
  required = true,
  rows = 3,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && "*"}
    </label>
    <div className="relative">
      <textarea
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        rows={rows}
        className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors resize-none ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50"
            : "border-gray-300 focus:border-amber-500 focus:ring-amber-500 hover:border-gray-400"
        }`}
        placeholder={placeholder}
      />
      {error && (
        <div className="absolute right-3 top-3">
          <BsExclamationCircle className="text-red-500" />
        </div>
      )}
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <BsExclamationCircle className="text-xs" />
        {error}
      </p>
    )}
  </div>
);

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
];

const StateSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = true,
  className = "",
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && "*"}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50"
            : "border-gray-300 focus:border-amber-500 focus:ring-amber-500 hover:border-gray-400"
        }`}
      >
        <option value="">Select a state</option>
        {INDIAN_STATES.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
      {error && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <BsExclamationCircle className="text-red-500" />
        </div>
      )}
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <BsExclamationCircle className="text-xs" />
        {error}
      </p>
    )}
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getSubtotal, clearCart } = useCart();

  // Form states
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [saveInfo, setSaveInfo] = useState(false);

  // Shipping info state
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

  // Billing info state
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  // Payment info state
  const [paymentInfo, setPaymentInfo] = useState({
    method: "upi", // Default to UPI payment
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    saveCard: false,
    saveUpi: false,
  });

  // Shipping options
  const shippingOptions = [
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

  const [selectedShipping, setSelectedShipping] = useState("standard");
  const selectedShippingOption = shippingOptions.find(
    (option) => option.id === selectedShipping
  );

  // Validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Calculate totals
  const subtotal = getSubtotal();
  const shippingCost = selectedShippingOption?.cost || 0;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shippingCost + tax;

  // Validation functions
  const validateField = (name, value, stepType) => {
    let error = "";

    // Common validations
    if (!value || !value.trim()) {
      return "This field is required";
    }

    // Step-specific validations
    if (stepType === "shipping") {
      switch (name) {
        case "firstName":
        case "lastName":
          if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
            error = "Must be 2-50 letters only";
          }
          break;

        case "email":
          if (!/^\S+@\S+\.\S+$/.test(value)) {
            error = "Please enter a valid email address";
          }
          break;

        case "phone":
          const phoneDigits = value.replace(/\D/g, "");
          if (!/^\d{10}$/.test(phoneDigits)) {
            error = "Phone number must be 10 digits";
          }
          break;

        case "address":
          if (value.length < 10) {
            error = "Address must be at least 10 characters";
          }
          break;

        case "city":
          // Only validate that it has letters, not regex pattern
          if (value.trim().length < 2) {
            error = "City must be at least 2 characters";
          }
          break;

        case "state":
          // Check if state is selected from dropdown
          if (!value) {
            error = "Please select a state";
          } else if (!INDIAN_STATES.includes(value)) {
            error = "Please select a valid state";
          }
          break;

        case "zipCode":
          if (!/^\d{6}$/.test(value)) {
            error = "ZIP code must be 6 digits";
          }
          break;

        default:
          break;
      }
    }

    if (stepType === "billing" && !sameAsShipping) {
      switch (name) {
        case "firstName":
        case "lastName":
          if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
            error = "Must be 2-50 letters only";
          }
          break;

        case "address":
          if (value.length < 10) {
            error = "Address must be at least 10 characters";
          }
          break;

        case "city":
          if (value.trim().length < 2) {
            error = "City must be at least 2 characters";
          }
          break;

        case "state":
          if (!value) {
            error = "Please select a state";
          } else if (!INDIAN_STATES.includes(value)) {
            error = "Please select a valid state";
          }
          break;

        case "zipCode":
          if (!/^\d{6}$/.test(value)) {
            error = "ZIP code must be 6 digits";
          }
          break;

        default:
          break;
      }
    }

    if (stepType === "payment") {
      switch (name) {
        case "cardNumber":
          const cardDigits = value.replace(/\s/g, "");
          if (!/^\d{16}$/.test(cardDigits)) {
            error = "Card number must be 16 digits";
          } else if (!validateLuhn(cardDigits)) {
            error = "Invalid card number";
          }
          break;

        case "cardName":
          if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
            error = "Must be 2-50 letters only";
          }
          break;

        case "expiryDate":
          if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
            error = "Format must be MM/YY";
          } else {
            const [month, year] = value.split("/");
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;

            if (
              parseInt(year) < currentYear ||
              (parseInt(year) === currentYear && parseInt(month) < currentMonth)
            ) {
              error = "Card has expired";
            }
          }
          break;

        case "cvv":
          if (!/^\d{3,4}$/.test(value)) {
            error = "CVV must be 3 or 4 digits";
          }
          break;

        case "upiId":
          if (!/^[\w\.\-_]+@[\w]+$/.test(value)) {
            error = "Enter a valid UPI ID (e.g., username@upi)";
          }
          break;

        default:
          break;
      }
    }

    return error;
  };

  // Luhn algorithm for credit card validation
  const validateLuhn = (cardNumber) => {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  // Handle field blur (mark as touched)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate the field
    let error = "";
    const value = e.target.value;

    if (step === 1) {
      error = validateField(name, value, "shipping");
    } else if (step === 2) {
      if (!sameAsShipping && name.startsWith("billing_")) {
        const fieldName = name.replace("billing_", "");
        error = validateField(fieldName, value, "billing");
      } else if (paymentInfo.method === "card") {
        if (["cardNumber", "cardName", "expiryDate", "cvv"].includes(name)) {
          error = validateField(name, value, "payment");
        }
      } else if (paymentInfo.method === "upi") {
        if (name === "upiId") {
          error = validateField(name, value, "payment");
        }
      }
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Handle shipping info change
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate as user types if field has been touched
    if (touched[name]) {
      const error = validateField(name, value, "shipping");
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  // Handle billing info change
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    const fieldName = name.replace("billing_", "");

    setBillingInfo((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Validate as user types if field has been touched
    if (touched[name]) {
      const error = validateField(fieldName, value, "billing");
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  // Handle payment info change
  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setPaymentInfo((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setPaymentInfo((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validate as user types if field has been touched
      if (touched[name] && name !== "method") {
        let error = "";
        if (paymentInfo.method === "card") {
          if (["cardNumber", "cardName", "expiryDate", "cvv"].includes(name)) {
            error = validateField(name, value, "payment");
          }
        } else if (paymentInfo.method === "upi") {
          if (name === "upiId") {
            error = validateField(name, value, "payment");
          }
        }

        if (error) {
          setErrors((prev) => ({
            ...prev,
            [name]: error,
          }));
        }
      }
    }
  };

  // Handle card number formatting
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);

    // Add spaces every 4 digits
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");

    setPaymentInfo((prev) => ({
      ...prev,
      cardNumber: value,
    }));

    // Validate as user types if field has been touched
    if (touched.cardNumber) {
      const error = validateField("cardNumber", value, "payment");
      setErrors((prev) => ({
        ...prev,
        cardNumber: error,
      }));
    }
  };

  // Handle expiry date formatting
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);

    // Add slash after 2 digits
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    setPaymentInfo((prev) => ({
      ...prev,
      expiryDate: value,
    }));

    // Validate as user types if field has been touched
    if (touched.expiryDate) {
      const error = validateField("expiryDate", value, "payment");
      setErrors((prev) => ({
        ...prev,
        expiryDate: error,
      }));
    }
  };

  // Handle UPI ID formatting
  const handleUpiIdChange = (e) => {
    let value = e.target.value.toLowerCase();

    // Auto-add @ if not present
    if (!value.includes("@") && value.length > 0) {
      value = value + "@";
    }

    setPaymentInfo((prev) => ({
      ...prev,
      upiId: value,
    }));

    // Validate as user types if field has been touched
    if (touched.upiId) {
      const error = validateField("upiId", value, "payment");
      setErrors((prev) => ({
        ...prev,
        upiId: error,
      }));
    }
  };

  // Validate all shipping fields
  const validateAllShipping = () => {
    const newErrors = {};
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
      const error = validateField(field, shippingInfo[field], "shipping");
      if (error) {
        newErrors[field] = error;
      }
    });

    return newErrors;
  };

  // Validate all billing fields
  const validateAllBilling = () => {
    if (sameAsShipping) return {};

    const newErrors = {};
    const fields = [
      "firstName",
      "lastName",
      "address",
      "city",
      "state",
      "zipCode",
    ];

    fields.forEach((field) => {
      const error = validateField(field, billingInfo[field], "billing");
      if (error) {
        newErrors[`billing_${field}`] = error;
      }
    });

    return newErrors;
  };

  // Validate all payment fields
  const validateAllPayment = () => {
    const newErrors = {};

    if (paymentInfo.method === "card") {
      const fields = ["cardNumber", "cardName", "expiryDate", "cvv"];
      fields.forEach((field) => {
        const error = validateField(field, paymentInfo[field], "payment");
        if (error) {
          newErrors[field] = error;
        }
      });
    } else if (paymentInfo.method === "upi") {
      const error = validateField("upiId", paymentInfo.upiId, "payment");
      if (error) {
        newErrors.upiId = error;
      }
    }

    return newErrors;
  };

  // Check if current step is valid
  const isStepValid = () => {
    if (step === 1) {
      const errors = validateAllShipping();
      return Object.keys(errors).length === 0;
    } else if (step === 2) {
      const billingErrors = validateAllBilling();
      const paymentErrors = validateAllPayment();
      return (
        Object.keys(billingErrors).length === 0 &&
        Object.keys(paymentErrors).length === 0
      );
    }
    return true;
  };

  // Handle next step
  const handleNextStep = () => {
    // Mark all fields as touched
    const newTouched = {};

    if (step === 1) {
      [
        "firstName",
        "lastName",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "zipCode",
      ].forEach((field) => {
        newTouched[field] = true;
      });
    } else if (step === 2) {
      if (!sameAsShipping) {
        [
          "firstName",
          "lastName",
          "address",
          "city",
          "state",
          "zipCode",
        ].forEach((field) => {
          newTouched[`billing_${field}`] = true;
        });
      }

      if (paymentInfo.method === "card") {
        ["cardNumber", "cardName", "expiryDate", "cvv"].forEach((field) => {
          newTouched[field] = true;
        });
      } else if (paymentInfo.method === "upi") {
        newTouched.upiId = true;
      }
    }

    setTouched((prev) => ({ ...prev, ...newTouched }));

    // Validate current step
    let stepErrors = {};

    if (step === 1) {
      stepErrors = validateAllShipping();
    } else if (step === 2) {
      const billingErrors = validateAllBilling();
      const paymentErrors = validateAllPayment();
      stepErrors = { ...billingErrors, ...paymentErrors };
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);

      // Find first error field and scroll to it
      const firstErrorField = Object.keys(stepErrors)[0];
      const element =
        document.getElementById(firstErrorField) ||
        document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }

      toast.error("Please correct the errors before proceeding");
      return;
    }

    // Copy shipping info to billing if checkbox is checked
    if (step === 1 && sameAsShipping) {
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
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    setLoading(true);

    // Simulate API call
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

      // Clear cart
      clearCart();

      // Beautiful and Unique Success Toast

      toast.success(
        <div className="w-full max-w-md">
          {/* Background gradient wrapper */}
          <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl shadow-2xl overflow-hidden border border-green-200">
            {/* Animated top border */}
            <div className="h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 animate-pulse"></div>

            {/* Close Button - Top Right */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss();
              }}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-md border border-green-200 hover:border-green-300 group"
              aria-label="Close notification"
            >
              <BsX className="text-gray-600 group-hover:text-red-500 text-xl transition-colors duration-200" />
            </button>

            {/* Content */}
            <div className="p-6 text-center pt-8">
              {/* Animated checkmark circle */}
              <div className="mb-4 flex justify-center">
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg transform animate-bounce">
                  <BsCheckCircle className="text-5xl text-white" />
                  {/* Floating particles */}
                  <div className="absolute inset-0 rounded-full">
                    <div className="absolute top-1 right-2 w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
                    <div
                      className="absolute bottom-2 left-3 w-1.5 h-1.5 bg-green-200 rounded-full animate-ping"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="absolute top-4 left-1 w-1 h-1 bg-emerald-300 rounded-full animate-ping"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Main heading */}
              <h3 className="font-bold text-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Order Placed Successfully! 🎉
              </h3>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent mb-4"></div>

              {/* Payment method specific messages */}
              <div className="space-y-2">
                {paymentInfo.method === "cod" && (
                  <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 animate-slideInUp">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <p className="text-sm font-semibold text-amber-800">
                        Keep cash ready for delivery
                      </p>
                    </div>
                    <p className="text-xs text-amber-700 mt-2">
                      Our delivery partner will contact you soon
                    </p>
                  </div>
                )}

                {paymentInfo.method === "upi" && (
                  <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 animate-slideInUp">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <p className="text-sm font-semibold text-blue-900">
                        Complete payment in your UPI app
                      </p>
                    </div>
                    <p className="text-xs text-blue-700 mt-2">
                      You'll receive a payment link shortly
                    </p>
                  </div>
                )}

                {paymentInfo.method === "card" && (
                  <div className="bg-purple-50 border border-purple-300 rounded-lg p-3 animate-slideInUp">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 bg-purple-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">💳</span>
                      </div>
                      <p className="text-sm font-semibold text-purple-900">
                        Payment processing in progress
                      </p>
                    </div>
                    <p className="text-xs text-purple-700 mt-2">
                      Check your email for confirmation
                    </p>
                  </div>
                )}
              </div>

              {/* Footer message */}
              <div className="mt-4 pt-4 border-t border-green-200">
                <p className="text-xs text-gray-600">
                  📧 Confirmation sent to your email • 🚚 Track your order
                  anytime
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full opacity-10 -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200 rounded-full opacity-10 -ml-12 -mb-12"></div>
          </div>

          {/* Floating confetti style elements */}
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
        </div>,
        {
          duration: 5000,
          position: "top-center",
          style: {
            background: "transparent",
            border: "none",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          },
          icon: null,
        }
      );
      // Navigate to home page
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }, 2000);
  };

  // Auto-fill billing when checkbox changes
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

  // Get field error message
  const getFieldError = (fieldName) => {
    return errors[fieldName];
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center animate-fadeInUp">
            <BsCreditCard className="text-5xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            Your cart is empty
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You need to add items to your cart before checking out.
          </p>
          <Link
            to="/cart"
            className="inline-block px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center justify-center">
          <div className="flex items-center w-full max-w-2xl">
            {/* Step 1 */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= 1
                    ? "bg-amber-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > 1 ? <BsCheckCircle /> : "1"}
              </div>
              <div
                className={`h-1 w-24 ${
                  step >= 2 ? "bg-amber-600" : "bg-gray-200"
                }`}
              ></div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= 2
                    ? "bg-amber-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > 2 ? <BsCheckCircle /> : "2"}
              </div>
              <div
                className={`h-1 w-24 ${
                  step >= 3 ? "bg-amber-600" : "bg-gray-200"
                }`}
              ></div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= 3
                    ? "bg-amber-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-2 text-sm text-gray-600 max-w-2xl mx-auto">
          <span className={step >= 1 ? "text-amber-600 font-medium" : ""}>
            Shipping
          </span>
          <span className={step >= 2 ? "text-amber-600 font-medium" : ""}>
            Payment
          </span>
          <span className={step >= 3 ? "text-amber-600 font-medium" : ""}>
            Review
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <ShippingComponent
                shippingInfo={shippingInfo}
                handleShippingChange={handleShippingChange}
                handleBlur={handleBlur}
                getFieldError={getFieldError}
                InputField={InputField}
                TextareaField={TextareaField}
                StateSelect={StateSelect}
                saveInfo={saveInfo}
                setSaveInfo={setSaveInfo}
              />
            )}

            {step === 2 && (
              <div className="space-y-6">
                <BillingComponent
                  sameAsShipping={sameAsShipping}
                  setSameAsShipping={setSameAsShipping}
                  billingInfo={billingInfo}
                  handleBillingChange={handleBillingChange}
                  handleBlur={handleBlur}
                  getFieldError={getFieldError}
                  InputField={InputField}
                  TextareaField={TextareaField}
                  StateSelect={StateSelect}
                />
                <PaymentComponent
                  paymentInfo={paymentInfo}
                  handlePaymentChange={handlePaymentChange}
                  handleCardNumberChange={handleCardNumberChange}
                  handleExpiryChange={handleExpiryChange}
                  handleUpiIdChange={handleUpiIdChange}
                  handleBlur={handleBlur}
                  getFieldError={getFieldError}
                  InputField={InputField}
                  total={total}
                />
              </div>
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
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
                >
                  <BsArrowLeft /> Previous Step
                </button>
              )}

              <div className="ml-auto">
                {step < 3 ? (
                  <button
                    onClick={handleNextStep}
                    disabled={!isStepValid()}
                    className={`px-8 py-3 text-white font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                      isStepValid()
                        ? "bg-gradient-to-r from-amber-600 to-amber-700"
                        : "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue to {step === 1 ? "Payment" : "Review"}
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium flex items-center">
                      <BsCurrencyRupee className="text-sm mr-1" />
                      {subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium flex items-center">
                      <BsCurrencyRupee className="text-sm mr-1" />
                      {shippingCost.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18% GST)</span>
                    <span className="font-medium flex items-center">
                      <BsCurrencyRupee className="text-sm mr-1" />
                      {tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-800">Total</span>
                      <span className="text-gray-900 flex items-center">
                        <BsCurrencyRupee className="text-base mr-1" />
                        {total.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Including all taxes and shipping
                    </p>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <RiSecurePaymentLine className="text-2xl text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      100% Secure Payment
                    </span>
                  </div>
                  <div className="flex justify-center gap-2">
                    <FaCcVisa className="text-2xl text-gray-400" />
                    <FaCcMastercard className="text-2xl text-gray-400" />
                    <FaCcAmex className="text-2xl text-gray-400" />
                    <BsPhone className="text-2xl text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-white shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-800 mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 flex items-center justify-center">
                      <BsTruck className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Free Shipping</p>
                      <p className="text-xs text-gray-600">
                        On orders over ₹999
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 flex items-center justify-center">
                      <BsShieldCheck className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Easy Returns</p>
                      <p className="text-xs text-gray-600">
                        30-day return policy
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 flex items-center justify-center">
                      <BsLock className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Secure Checkout</p>
                      <p className="text-xs text-gray-600">SSL encrypted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
