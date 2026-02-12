import React from "react";
import {
  BsCreditCard,
  BsCash,
  BsShieldCheck,
} from "react-icons/bs";

const PaymentComponent = ({
  data = {},
  setData,
  total,
}) => {
  // Custom color definitions
  const primaryColor = '#C19A6B';
  const primaryLight = '#E8D4B9';
  const primaryDark = '#A07A4B';

  // Ensure payment data has all required fields
  const paymentData = {
    method: "online",
    ...data,
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setData({ ...paymentData, method: value });
  };

  const paymentMethods = [
    {
      value: "online",
      label: "Online Payment",
      icon: BsCreditCard,
      desc: "Pay securely via Razorpay (UPI, Cards, NetBanking, Wallets)",
      recommended: true,
    },
    {
      value: "cod",
      label: "Cash on Delivery",
      icon: BsCash,
      desc: "Pay when you receive your order (+₹50 COD charges)",
      recommended: false,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <style>{`
        .custom-radio:checked {
          background-color: ${primaryColor};
          border-color: ${primaryColor};
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryLight + '30' }}>
            <BsCreditCard className="text-2xl" style={{ color: primaryColor }} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Payment Information</h2>
            <p className="text-sm text-gray-500">Choose your preferred payment method</p>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm text-gray-500">Total Payable</span>
          <span className="text-2xl font-bold" style={{ color: primaryColor }}>
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Payment Selection Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Method Selection - Left Column */}
        <div className="lg:col-span-1 space-y-4">
          {paymentMethods.map((option) => {
            const IconComponent = option.icon;
            const isSelected = paymentData.method === option.value;

            return (
              <label
                key={option.value}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden ${isSelected
                    ? "shadow-md transform scale-[1.02]"
                    : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                  }`}
                style={isSelected ? {
                  borderColor: primaryColor,
                  backgroundColor: 'white'
                } : {}}
              >
                {isSelected && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                )}

                <input
                  type="radio"
                  name="payment-method"
                  value={option.value}
                  checked={isSelected}
                  onChange={handleChange}
                  className="sr-only custom-radio"
                />

                <div className="flex items-center gap-4 w-full pl-2">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? "text-white" : "text-gray-500 bg-gray-100 group-hover:bg-gray-200"
                      }`}
                    style={isSelected ? { backgroundColor: primaryColor } : {}}
                  >
                    <IconComponent className="text-xl" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                        {option.label}
                      </h4>
                    </div>
                  </div>

                  {option.recommended && !isSelected && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                      Best
                    </span>
                  )}

                  {isSelected && (
                    <div style={{ color: primaryColor }} className="text-lg">
                      <BsShieldCheck />
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {/* Details Panel - Right Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full p-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5">
              {paymentMethods.find(m => m.value === paymentData.method)?.icon({ className: "text-9xl" })}
            </div>

            {/* Online Payment Details */}
            {paymentData.method === "online" && (
              <div className="relative z-10 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    Secure Online Payment
                    <span className="text-xs font-normal px-2 py-1 bg-green-100 text-green-700 rounded-full">Fastest</span>
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Complete your purchase securely using Razorpay.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-dashed border-gray-300 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                    <img
                      src="https://razorpay.com/assets/razorpay-logo.svg"
                      alt="Razorpay"
                      className="h-8 object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="flex gap-2">
                      {['Cards', 'UPI', 'NetBanking', 'Wallet'].map(m => (
                        <span key={m} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600 font-medium">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500 flex items-center gap-1 justify-center sm:justify-start">
                    <BsShieldCheck className="text-green-600" />
                    128-bit Encrypted. We do not store your card details.
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Product Total</span>
                    <span className="font-medium text-gray-900">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Convenience Fee</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-gray-800">Total Payable</span>
                    <span className="font-bold text-xl" style={{ color: primaryColor }}>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* COD Details */}
            {paymentData.method === "cod" && (
              <div className="relative z-10 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    Cash on Delivery
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Pay cash when you receive your order at your doorstep.
                  </p>
                </div>

                <div
                  className="p-5 rounded-xl border border-yellow-200 bg-yellow-50"
                >
                  <div className="flex gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full h-fit text-yellow-700">
                      <BsCash className="text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-yellow-800 mb-1">COD Terms</h4>
                      <ul className="text-sm text-yellow-800/80 space-y-1 list-disc pl-4">
                        <li>Pay exact amount of <b>₹{(total + 50).toLocaleString('en-IN')}</b> upon delivery.</li>
                        <li>Additional ₹50 handling fee applies for COD orders.</li>
                        <li>Please ensure someone is available to receive the package.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Product Total</span>
                    <span className="font-medium text-gray-900">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">COD Handling Fee</span>
                    <span className="font-medium text-gray-900">₹50</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-gray-800">Total Payable</span>
                    <span className="font-bold text-xl" style={{ color: primaryColor }}>₹{(total + 50).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Footer Security Notice */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
        <BsShieldCheck />
        <span>Secure Payment • 256-bit SSL Encryption • Trusted Checkout</span>
      </div>
    </div>
  );
};

// Validate payment data
PaymentComponent.validate = async (data) => {
  if (!data || !data.method) return false;
  return ["online", "cod"].includes(data.method);
};

export default PaymentComponent;
