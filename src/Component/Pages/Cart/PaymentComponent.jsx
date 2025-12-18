import React from "react";
import {
  BsCreditCard,
  BsPhone,
  BsCash,
  BsShieldCheck,
} from "react-icons/bs";
import { FaQrcode } from "react-icons/fa";
import { validatePaymentField } from "../../utils/Validation";

const PaymentComponent = ({
  data = {},
  setData,
  errors = {},
  setErrors,
  touched = {},
  setTouched,
  total,
}) => {
  // Ensure payment data has all required fields
  const paymentData = {
    method: "upi",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    saveCard: false,
    saveUpi: false,
    ...data,
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle radio button for payment method selection
    if (type === "radio") {
      setData({ ...paymentData, method: value });
      return;
    }

    // Handle checkbox
    if (type === "checkbox") {
      setData({ ...paymentData, [name]: checked });
      return;
    }

    // Handle regular input
    setData({ ...paymentData, [name]: value });

    // Validate if field was touched
    if (touched[name] && name !== "method") {
      const error = validatePaymentField(name, value, paymentData.method);
      if (error) {
        setErrors({ ...errors, [name]: error });
      } else {
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
      }
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");

    setData({ ...paymentData, cardNumber: value });

    if (touched.cardNumber) {
      const error = validatePaymentField("cardNumber", value, paymentData.method);
      if (error) {
        setErrors({ ...errors, cardNumber: error });
      } else {
        const newErrors = { ...errors };
        delete newErrors.cardNumber;
        setErrors(newErrors);
      }
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    setData({ ...paymentData, expiryDate: value });

    if (touched.expiryDate) {
      const error = validatePaymentField("expiryDate", value, paymentData.method);
      if (error) {
        setErrors({ ...errors, expiryDate: error });
      } else {
        const newErrors = { ...errors };
        delete newErrors.expiryDate;
        setErrors(newErrors);
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validatePaymentField(name, paymentData[name], paymentData.method);
    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  const paymentMethods = [
    {
      value: "card",
      label: "Credit/Debit Card",
      icon: BsCreditCard,
      desc: "Visa, Mastercard, Amex",
    },
    {
      value: "upi",
      label: "UPI Payment",
      icon: BsPhone,
      desc: "GPay, PhonePe, Paytm",
    },
    {
      value: "cod",
      label: "Cash on Delivery",
      icon: BsCash,
      desc: "Pay on delivery",
    },
  ];

  return (
    <div className="bg-white shadow-sm border border-gray-200 p-6 mt-6">
      <div className="flex items-center gap-3 mb-6">
        <BsCreditCard className="text-2xl text-amber-600" />
        <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
      </div>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {paymentMethods.map((option) => {
          const IconComponent = option.icon;
          const isSelected = paymentData.method === option.value;

          return (
            <label
              key={option.value}
              className={`flex items-center p-4 border cursor-pointer transition-all duration-200 rounded-lg ${
                isSelected
                  ? "border-amber-500 bg-amber-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value={option.value}
                checked={isSelected}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex items-center gap-3 w-full">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected
                      ? "bg-amber-200 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <IconComponent className="text-2xl" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {option.label}
                  </h4>
                  <p className="text-xs text-gray-500">{option.desc}</p>
                </div>
                {isSelected && (
                  <div className="text-amber-600 font-bold text-lg">✓</div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Card Payment Form */}
      {paymentData.method === "card" && (
        <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4">Card Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={paymentData.cardNumber}
              onChange={handleCardNumberChange}
              onBlur={handleBlur}
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                errors.cardNumber
                  ? "border-red-500 focus:ring-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name on Card <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="cardName"
              value={paymentData.cardName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="JOHN DOE"
              className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                errors.cardName
                  ? "border-red-500 focus:ring-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.cardName && (
              <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={paymentData.expiryDate}
                onChange={handleExpiryChange}
                onBlur={handleBlur}
                name="expiryDate"
                placeholder="MM/YY"
                className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  errors.expiryDate
                    ? "border-red-500 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.expiryDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="cvv"
                value={paymentData.cvv}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="123"
                maxLength="4"
                className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  errors.cvv
                    ? "border-red-500 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.cvv && (
                <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
              )}
            </div>
          </div>

          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              name="saveCard"
              checked={paymentData.saveCard}
              onChange={handleChange}
              className="h-4 w-4 text-amber-600"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Save card for future purchases
            </label>
          </div>
        </div>
      )}

      {/* UPI Payment Form */}
      {paymentData.method === "upi" && (
        <div className="space-y-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4">UPI Payment</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="upiId"
              value={paymentData.upiId}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="yourname@upi"
              className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                errors.upiId
                  ? "border-red-500 focus:ring-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
            />
            {errors.upiId && (
              <p className="mt-1 text-sm text-red-600">{errors.upiId}</p>
            )}
            <p className="mt-1 text-xs text-gray-600">
              Examples: yourname@okicici, yourname@ybl, yourname@paytm
            </p>
          </div>

          <div className="p-4 bg-white border border-purple-300 rounded-lg">
            <div className="flex items-center justify-center gap-3 flex-col">
              <FaQrcode className="text-4xl text-purple-600" />
              <div className="text-center">
                <p className="font-semibold text-gray-800">Scan to Pay</p>
                <p className="text-lg font-bold text-purple-600 mt-1">
                  ₹{total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Use any UPI app to scan and pay
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="saveUpi"
              checked={paymentData.saveUpi}
              onChange={handleChange}
              className="h-4 w-4 text-amber-600"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Save UPI ID for future purchases
            </label>
          </div>
        </div>
      )}

      {/* Cash on Delivery Form */}
      {paymentData.method === "cod" && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg">
          <div className="flex gap-3">
            <BsCash className="text-2xl text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">
                Cash on Delivery
              </h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>✓ Pay when you receive your order</li>
                <li>✓ No advance payment required</li>
                <li>✓ A delivery fee of ₹50 may apply</li>
                <li>✓ Keep exact change ready for faster delivery</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
        <BsShieldCheck className="text-blue-600 text-xl flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-semibold text-blue-900 mb-1">Secure Payment</h4>
          <p className="text-sm text-blue-700">
            Your payment information is encrypted and secure. We never store
            your complete card details or UPI information.
          </p>
        </div>
      </div>
    </div>
  );
};

// Validate payment data
PaymentComponent.validate = async (data) => {
  if (!data || !data.method) return false;

  if (data.method === "card") {
    const fields = ["cardNumber", "cardName", "expiryDate", "cvv"];
    for (let field of fields) {
      if (validatePaymentField(field, data[field], data.method)) {
        return false;
      }
    }
  } else if (data.method === "upi") {
    if (validatePaymentField("upiId", data.upiId, data.method)) {
      return false;
    }
  }
  // COD doesn't require validation
  return true;
};

export default PaymentComponent;