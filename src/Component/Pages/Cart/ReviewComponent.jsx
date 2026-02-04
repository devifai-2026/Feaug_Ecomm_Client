import React from "react";
import { BsCheckCircle, BsLock, BsCurrencyRupee } from "react-icons/bs";

export const ReviewComponent = ({
  shippingInfo,
  billingInfo,
  paymentInfo,
  cartItems,
  selectedShippingOption,
  subtotal,
  shippingCost,
  tax,
  total,
}) => (
  <div className="bg-white shadow-sm border border-gray-200 p-6">
    <div className="flex items-center gap-3 mb-6">
      <BsCheckCircle className="text-2xl text-green-600" />
      <h2 className="text-2xl font-bold text-gray-800">Review Your Order</h2>
    </div>

    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Shipping</h3>
        <div className="bg-gray-50 p-4 rounded-md text-sm">
          <p className="font-medium">
            {shippingInfo.firstName} {shippingInfo.lastName}
          </p>
          <p>{shippingInfo.address}</p>
          <p>
            {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
          </p>
          <p className="mt-2">📧 {shippingInfo.email}</p>
          <p>📱 {shippingInfo.phone}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Billing</h3>
        <div className="bg-gray-50 p-4 rounded-md text-sm">
          <p className="font-medium">
            {billingInfo.firstName} {billingInfo.lastName}
          </p>
          <p>{billingInfo.address}</p>
          <p>
            {billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment</h3>
        <div className="bg-gray-50 p-4 rounded-md text-sm">
          {paymentInfo.method === "online" && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                💳
              </div>
              <div>
                <p className="font-medium text-blue-700">Online Payment</p>
                <p className="text-gray-600 text-xs">Pay securely via Razorpay</p>
              </div>
            </div>
          )}
          {paymentInfo.method === "cod" && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                💵
              </div>
              <div>
                <p className="font-medium text-amber-600">Cash on Delivery</p>
                <p className="text-gray-600 text-xs">Pay when you receive your order (+₹50 COD charges)</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Items</h3>
        <div className="space-y-3">
          {cartItems.map((item, i) => (
            <div key={i} className="flex justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold flex items-center">
                <BsCurrencyRupee className="text-sm mr-1" />
                {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md flex gap-3">
      <BsLock className="text-amber-600 text-xl flex-shrink-0" />
      <p className="text-sm text-amber-700">
        By placing this order, you agree to our Terms of Service.
      </p>
    </div>
  </div>
);
