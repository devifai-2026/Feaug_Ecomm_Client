import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  BsCheckCircleFill,
  BsXCircleFill,
  BsArrowRight,
  BsReceipt,
  BsHouseDoor,
} from "react-icons/bs";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const error = searchParams.get("error");

  const isSuccess = status === "success";

  // Custom color definitions
  const primaryColor = "#C19A6B";
  const primaryDark = "#A07A4B";

  // Auto redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect to orders page
      navigate("/myOrders");
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Status Header */}
          <div
            className={`py-8 px-6 text-center ${
              isSuccess
                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                : "bg-gradient-to-br from-red-500 to-rose-600"
            }`}
          >
            <div className="flex justify-center mb-4">
              {isSuccess ? (
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <BsCheckCircleFill className="text-5xl text-white" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <BsXCircleFill className="text-5xl text-white" />
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSuccess ? "Payment Successful!" : "Payment Failed"}
            </h1>
            <p className="text-white/80">
              {isSuccess
                ? "Your order has been confirmed"
                : error || "Something went wrong with your payment"}
            </p>
          </div>

          {/* Order Details */}
          <div className="p-6">
            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Order ID</p>
                <p className="text-lg font-semibold text-gray-800">{orderId}</p>
              </div>
            )}

            {isSuccess && (
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <BsCheckCircleFill className="text-green-500" />
                  <span>Payment has been received</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <BsCheckCircleFill className="text-green-500" />
                  <span>Order confirmed and being processed</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <BsCheckCircleFill className="text-green-500" />
                  <span>You will receive tracking details soon</span>
                </div>
              </div>
            )}

            {!isSuccess && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700">
                  Don't worry! Your order has been saved. You can retry the
                  payment from your orders page.
                </p>
              </div>
            )}

            {/* Countdown */}
            <p className="text-center text-gray-500 mb-6">
              Redirecting to orders in{" "}
              <span className="font-semibold">{countdown}</span> seconds...
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/myOrders")}
                className="w-full py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                <BsReceipt />
                View My Orders
                <BsArrowRight />
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full py-3 rounded-lg font-medium border border-gray-300 text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
              >
                <BsHouseDoor />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Secure payment processed by Razorpay
        </p>
      </div>
    </div>
  );
};

export default PaymentStatus;
