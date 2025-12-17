// Component/Pages/Cart/ReviewComponent.jsx
import React from 'react';
import { BsCheckCircle, BsLock, BsCurrencyRupee } from 'react-icons/bs';

const ReviewComponent = ({
  shippingInfo,
  billingInfo,
  paymentInfo,
  cartItems,
  selectedShippingOption,
  subtotal,
  shippingCost,
  tax,
  total
}) => {
  return (
    <div className="bg-white shadow-sm border border-gray-200 p-6 animate-fadeInUp">
      <div className="flex items-center gap-3 mb-6">
        <BsCheckCircle className="text-2xl text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Review Your Order
        </h2>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        {/* Shipping Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Shipping Information
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="font-medium">
              {shippingInfo.firstName} {shippingInfo.lastName}
            </p>
            <p>{shippingInfo.address}</p>
            <p>
              {shippingInfo.city}, {shippingInfo.state}{" "}
              {shippingInfo.zipCode}
            </p>
            <p>{shippingInfo.country}</p>
            <p className="mt-2">📧 {shippingInfo.email}</p>
            <p>📱 {shippingInfo.phone}</p>
          </div>
        </div>

        {/* Billing Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Billing Information
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="font-medium">
              {billingInfo.firstName} {billingInfo.lastName}
            </p>
            <p>{billingInfo.address}</p>
            <p>
              {billingInfo.city}, {billingInfo.state}{" "}
              {billingInfo.zipCode}
            </p>
            <p>{billingInfo.country}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Payment Method
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {paymentInfo.method === "card" && (
              <>
                <p className="font-medium">Credit/Debit Card</p>
                <p className="text-gray-600">
                  Card ending in {paymentInfo.cardNumber.slice(-4)}
                </p>
              </>
            )}
            {paymentInfo.method === "upi" && (
              <>
                <p className="font-medium">UPI Payment</p>
                <p className="text-gray-600">
                  UPI ID: {paymentInfo.upiId}
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Please complete payment in your UPI app
                </p>
              </>
            )}
            {paymentInfo.method === "cod" && (
              <>
                <p className="font-medium">Cash on Delivery (COD)</p>
                <p className="text-amber-600">
                  Please keep cash ready for delivery
                </p>
              </>
            )}
          </div>
        </div>

        {/* Shipping Method */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Shipping Method
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="font-medium">
              {selectedShippingOption.name}
            </p>
            <p className="text-gray-600">
              {selectedShippingOption.days}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Order Items
          </h3>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-md"
              >
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image || "/placeholder-image.jpg"}
                    alt={item.title || "Product"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="font-bold text-gray-900 flex items-center">
                  <BsCurrencyRupee className="text-sm mr-1" />
                  {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex items-start gap-3">
          <BsLock className="text-xl text-amber-600 mt-1" />
          <div>
            <h4 className="font-medium text-amber-800 mb-1">
              Terms & Conditions
            </h4>
            <p className="text-sm text-amber-700">
              By placing this order, you agree to our Terms of Service
              and Privacy Policy. All orders are subject to
              availability and confirmation of the order price.
              Delivery times are estimates and cannot be guaranteed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewComponent;