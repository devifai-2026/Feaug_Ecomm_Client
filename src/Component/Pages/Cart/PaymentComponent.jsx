import React from "react";
import {
  BsCreditCard,
  BsCash,
  BsShieldCheck,
} from "react-icons/bs";
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
  // Custom color definitions
  const primaryColor = '#C19A6B';
  const primaryLight = '#E8D4B9';
  const primaryDark = '#A07A4B';
  
  // Ensure payment data has all required fields
  const paymentData = {
    method: "online", // Changed default to "online"
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
      value: "online",
      label: "Online Payment",
      icon: BsCreditCard,
      desc: "Credit/Debit Card, UPI, Net Banking",
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
      <style>{`
        .custom-checkbox:checked {
          background-color: ${primaryColor};
          border-color: ${primaryColor};
        }
        .custom-radio:checked {
          background-color: ${primaryColor};
          border-color: ${primaryColor};
        }
      `}</style>
      
      <div className="flex items-center gap-3 mb-6">
        <BsCreditCard className="text-2xl" style={{ color: primaryColor }} />
        <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
      </div>

      {/* Payment Method Selection - Now only 2 options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {paymentMethods.map((option) => {
          const IconComponent = option.icon;
          const isSelected = paymentData.method === option.value;

          return (
            <label
              key={option.value}
              className={`flex items-center p-4 border cursor-pointer transition-all duration-200 rounded-lg ${
                isSelected
                  ? "border-2"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
              style={isSelected ? { 
                borderColor: primaryColor,
                backgroundColor: primaryLight + '20'
              } : {}}
            >
              <input
                type="radio"
                name="payment-method"
                value={option.value}
                checked={isSelected}
                onChange={handleChange}
                className="sr-only custom-radio"
              />
              <div className="flex items-center gap-3 w-full">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected
                      ? "text-amber-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  style={isSelected ? { 
                    backgroundColor: primaryLight
                  } : {}}
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
                  <div style={{ color: primaryColor }} className="font-bold text-lg">✓</div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Online Payment Form - Combined Card and UPI */}
      {paymentData.method === "online" && (
        <div 
          className="space-y-4 p-4 border rounded-lg"
          style={{ 
            backgroundColor: primaryLight + '10',
            borderColor: primaryLight
          }}
        >
          <h3 className="font-semibold text-gray-800 mb-4">Online Payment</h3>
          
          {/* Payment Type Selection within Online Payment */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <label
              className={`flex items-center justify-center p-4 border cursor-pointer transition-all duration-200 rounded-lg ${
                paymentData.onlineType === "card" || !paymentData.onlineType
                  ? "border-2"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
              style={(paymentData.onlineType === "card" || !paymentData.onlineType) ? { 
                borderColor: primaryColor,
                backgroundColor: primaryLight + '20'
              } : {}}
              onClick={() => setData({ ...paymentData, onlineType: "card" })}
            >
              <input
                type="radio"
                name="online-type"
                value="card"
                checked={paymentData.onlineType === "card" || !paymentData.onlineType}
                onChange={(e) => setData({ ...paymentData, onlineType: e.target.value })}
                className="sr-only"
              />
              <div className="flex flex-col items-center gap-2">
                <BsCreditCard className="text-xl" />
                <span className="text-sm font-medium">Card</span>
              </div>
            </label>
            
            <label
              className={`flex items-center justify-center p-4 border cursor-pointer transition-all duration-200 rounded-lg ${
                paymentData.onlineType === "upi"
                  ? "border-2"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
              style={paymentData.onlineType === "upi" ? { 
                borderColor: primaryColor,
                backgroundColor: primaryLight + '20'
              } : {}}
              onClick={() => setData({ ...paymentData, onlineType: "upi" })}
            >
              <input
                type="radio"
                name="online-type"
                value="upi"
                checked={paymentData.onlineType === "upi"}
                onChange={(e) => setData({ ...paymentData, onlineType: e.target.value })}
                className="sr-only"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="text-xl font-semibold">UPI</div>
                <span className="text-sm font-medium">GPay/PhonePe</span>
              </div>
            </label>
          </div>

          {/* Card Payment Form */}
          {(paymentData.onlineType === "card" || !paymentData.onlineType) && (
            <div className="space-y-4">
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
                      : "border-gray-300"
                  }`}
                  style={!errors.cardNumber ? { '--tw-ring-color': primaryColor } : {}}
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
                      : "border-gray-300"
                  }`}
                  style={!errors.cardName ? { '--tw-ring-color': primaryColor } : {}}
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
                        : "border-gray-300"
                    }`}
                    style={!errors.expiryDate ? { '--tw-ring-color': primaryColor } : {}}
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
                        : "border-gray-300"
                    }`}
                    style={!errors.cvv ? { '--tw-ring-color': primaryColor } : {}}
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
                  className="h-4 w-4 custom-checkbox"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Save card for future purchases
                </label>
              </div>
            </div>
          )}

          {/* UPI Payment Form */}
          {paymentData.onlineType === "upi" && (
            <div className="space-y-4">
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
                      : "border-gray-300"
                  }`}
                  style={!errors.upiId ? { '--tw-ring-color': primaryColor } : {}}
                />
                {errors.upiId && (
                  <p className="mt-1 text-sm text-red-600">{errors.upiId}</p>
                )}
                <p className="mt-1 text-xs text-gray-600">
                  Examples: yourname@okicici, yourname@ybl, yourname@paytm
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="saveUpi"
                  checked={paymentData.saveUpi}
                  onChange={handleChange}
                  className="h-4 w-4 custom-checkbox"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Save UPI ID for future purchases
                </label>
              </div>
            </div>
          )}

          {/* Payment Amount */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount:</span>
              <span style={{ color: primaryColor }} className="text-xl font-bold">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Cash on Delivery Form */}
      {paymentData.method === "cod" && (
        <div 
          className="p-4 border rounded-lg"
          style={{ 
            backgroundColor: primaryLight + '20',
            borderColor: primaryColor
          }}
        >
          <div className="flex gap-3">
            <BsCash className="text-2xl flex-shrink-0 mt-1" style={{ color: primaryDark }} />
            <div>
              <h3 className="font-semibold mb-2" style={{ color: primaryDark }}>
                Cash on Delivery
              </h3>
              <ul className="text-sm space-y-1" style={{ color: primaryDark }}>
                <li>✓ Pay when you receive your order</li>
                <li>✓ No advance payment required</li>
                <li>✓ A delivery fee of ₹50 may apply</li>
                <li>✓ Keep exact change ready for faster delivery</li>
              </ul>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount:</span>
                  <span style={{ color: primaryColor }} className="text-xl font-bold">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div 
        className="mt-6 p-4 border rounded-lg flex gap-3"
        style={{ 
          backgroundColor: primaryLight + '10',
          borderColor: primaryLight
        }}
      >
        <BsShieldCheck className="text-xl flex-shrink-0 mt-1" style={{ color: primaryColor }} />
        <div>
          <h4 className="font-semibold mb-1" style={{ color: primaryDark }}>
            Secure Payment
          </h4>
          <p className="text-sm" style={{ color: primaryDark }}>
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

  if (data.method === "online") {
    // If online payment, check if card or UPI is selected and validate accordingly
    if (data.onlineType === "card" || !data.onlineType) {
      const fields = ["cardNumber", "cardName", "expiryDate", "cvv"];
      for (let field of fields) {
        if (validatePaymentField(field, data[field], "card")) {
          return false;
        }
      }
    } else if (data.onlineType === "upi") {
      if (validatePaymentField("upiId", data.upiId, "upi")) {
        return false;
      }
    } else {
      return false; // No online type selected
    }
  }
  // COD doesn't require validation
  return true;
};

export default PaymentComponent;