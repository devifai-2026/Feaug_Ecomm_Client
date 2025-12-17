// Component/Pages/Cart/PaymentComponent.jsx
import React from 'react';
import { BsCreditCard, BsPhone, BsCash, BsShieldCheck } from 'react-icons/bs';
import { FaQrcode } from 'react-icons/fa';
import { RiBankLine } from 'react-icons/ri';

const PaymentComponent = ({
  paymentInfo,
  handlePaymentChange,
  handleCardNumberChange,
  handleExpiryChange,
  handleUpiIdChange,
  handleBlur,
  getFieldError,
  InputField,
  total
}) => {
  return (
    <div className="bg-white shadow-sm border border-gray-200 p-6 animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <BsCreditCard className="text-2xl text-amber-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Payment Method
        </h2>
      </div>

      <div className="space-y-4">
        {/* Payment Options - Card, UPI, and COD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Card Payment */}
          <label
            className={`flex items-center p-4 border cursor-pointer transition-all duration-200 ${
              paymentInfo.method === "card"
                ? "border-amber-500 bg-amber-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="method"
              value="card"
              checked={paymentInfo.method === "card"}
              onChange={handlePaymentChange}
              className="sr-only"
            />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                <BsCreditCard className="text-2xl text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">
                  Credit/Debit Card
                </h4>
                <p className="text-sm text-gray-600">
                  Visa, Mastercard, Amex
                </p>
              </div>
            </div>
          </label>

          {/* UPI Payment */}
          <label
            className={`flex items-center p-4 border cursor-pointer transition-all duration-200 ${
              paymentInfo.method === "upi"
                ? "border-amber-500 bg-amber-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="method"
              value="upi"
              checked={paymentInfo.method === "upi"}
              onChange={handlePaymentChange}
              className="sr-only"
            />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center">
                <BsPhone className="text-2xl text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">
                  UPI Payment
                </h4>
                <p className="text-sm text-gray-600">
                  GPay, PhonePe, Paytm
                </p>
              </div>
            </div>
          </label>

          {/* Cash on Delivery */}
          <label
            className={`flex items-center p-4 border cursor-pointer transition-all duration-200 ${
              paymentInfo.method === "cod"
                ? "border-amber-500 bg-amber-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="method"
              value="cod"
              checked={paymentInfo.method === "cod"}
              onChange={handlePaymentChange}
              className="sr-only"
            />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                <BsCash className="text-2xl text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">
                  Cash on Delivery
                </h4>
                <p className="text-sm text-gray-600">
                  Pay when you receive
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Credit Card Form - Only shown for card payment */}
        {paymentInfo.method === "card" && (
          <div className="space-y-6">
            <InputField
              label="Card Number"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={handleCardNumberChange}
              onBlur={handleBlur}
              placeholder="1234 5678 9012 3456"
              error={getFieldError("cardNumber")}
              className="md:col-span-2"
            />

            <InputField
              label="Name on Card"
              name="cardName"
              value={paymentInfo.cardName}
              onChange={handlePaymentChange}
              onBlur={handleBlur}
              placeholder="Enter name as on card"
              error={getFieldError("cardName")}
              className="md:col-span-2"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Expiry Date"
                name="expiryDate"
                value={paymentInfo.expiryDate}
                onChange={handleExpiryChange}
                onBlur={handleBlur}
                placeholder="MM/YY"
                error={getFieldError("expiryDate")}
              />

              <InputField
                label="CVV"
                name="cvv"
                type="password"
                value={paymentInfo.cvv}
                onChange={handlePaymentChange}
                onBlur={handleBlur}
                placeholder="123"
                error={getFieldError("cvv")}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="saveCard"
                checked={paymentInfo.saveCard}
                onChange={handlePaymentChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Save card for future purchases
              </label>
            </div>
          </div>
        )}

        {/* UPI Form - Only shown for UPI payment */}
        {paymentInfo.method === "upi" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField
                  label="UPI ID"
                  name="upiId"
                  value={paymentInfo.upiId}
                  onChange={handleUpiIdChange}
                  onBlur={handleBlur}
                  placeholder="username@upi"
                  error={getFieldError("upiId")}
                  className="md:col-span-2"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Example: yourname@okicici, yournumber@ybl,
                  yourname@paytm
                </p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <FaQrcode className="text-purple-600" />
                    Pay via QR Code
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Scan this QR code with any UPI app to pay
                    instantly.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                        <BsPhone className="text-purple-600 text-sm" />
                      </div>
                      <span className="text-sm text-gray-700">
                        GPay, PhonePe, Paytm
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                        <RiBankLine className="text-purple-600 text-sm" />
                      </div>
                      <span className="text-sm text-gray-700">
                        All UPI apps supported
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-48 h-48 bg-white p-4 rounded-lg border border-gray-300 flex flex-col items-center justify-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center mb-2">
                    {/* Placeholder for QR code */}
                    <div className="text-center">
                      <FaQrcode className="text-4xl text-gray-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">
                        QR Code
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Scan to pay ₹{total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="saveUpi"
                checked={paymentInfo.saveUpi}
                onChange={handlePaymentChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Save UPI ID for future purchases
              </label>
            </div>
          </div>
        )}

        {/* COD Notice */}
        {paymentInfo.method === "cod" && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-start gap-3">
              <BsCash className="text-xl text-amber-600 mt-1" />
              <div>
                <h4 className="font-medium text-amber-800 mb-1">
                  Cash on Delivery
                </h4>
                <p className="text-sm text-amber-700">
                  • Please keep exact change ready for delivery
                  <br />
                  • A delivery fee of ₹50 may apply
                  <br />• Order will be confirmed via phone call
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start gap-3">
            <BsShieldCheck className="text-xl text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">
                Secure Payment
              </h4>
              <p className="text-sm text-blue-700">
                Your payment information is encrypted and secure. We
                never store your complete card or UPI details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;