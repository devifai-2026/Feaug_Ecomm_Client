import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  BsCheckCircleFill,
  BsXCircleFill,
  BsArrowRight,
  BsReceipt,
  BsHouseDoor,
} from "react-icons/bs";
import paymentApi from "../../../apis/paymentApi";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [currentStatus, setCurrentStatus] = useState(searchParams.get("status"));
  const pollRef = useRef(null);
  const pollCountRef = useRef(0);

  const orderId = searchParams.get("orderId");
  const error = searchParams.get("error");

  const isSuccess = currentStatus === "success";
  const isPending = currentStatus === "pending";
  const isFailed = currentStatus === "failed";

  const primaryColor = "#C19A6B";

  // Poll payment status when pending
  useEffect(() => {
    if (isPending && orderId) {
      pollRef.current = setInterval(() => {
        pollCountRef.current += 1;

        // Stop polling after 40 attempts (~2 minutes)
        if (pollCountRef.current > 40) {
          clearInterval(pollRef.current);
          setCurrentStatus("failed");
          return;
        }

        paymentApi.getPaymentStatus({
          orderId,
          onSuccess: (data) => {
            if (data.success && data.data?.paymentStatus === "paid") {
              clearInterval(pollRef.current);
              setCurrentStatus("success");
            } else if (data.data?.paymentStatus === "failed") {
              clearInterval(pollRef.current);
              setCurrentStatus("failed");
            }
          },
          onError: () => {
            // Keep polling on error
          },
        });
      }, 3000);

      return () => clearInterval(pollRef.current);
    }
  }, [isPending, orderId]);

  // Auto redirect countdown (only when not pending)
  useEffect(() => {
    if (isPending) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/myOrders");
    }
  }, [countdown, navigate, isPending]);

  // Reset countdown when status changes from pending
  useEffect(() => {
    if (!isPending && currentStatus !== searchParams.get("status")) {
      setCountdown(5);
    }
  }, [currentStatus, isPending, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Status Header */}
          <div
            className={`py-8 px-6 text-center ${
              isSuccess
                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                : isPending
                  ? "bg-gradient-to-br from-amber-500 to-orange-500"
                  : "bg-gradient-to-br from-red-500 to-rose-600"
            }`}
          >
            <div className="flex justify-center mb-4">
              {isSuccess && (
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <BsCheckCircleFill className="text-5xl text-white" />
                </div>
              )}
              {isPending && (
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {isFailed && (
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <BsXCircleFill className="text-5xl text-white" />
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSuccess
                ? "Payment Successful!"
                : isPending
                  ? "Verifying Payment..."
                  : "Payment Failed"}
            </h1>
            <p className="text-white/80">
              {isSuccess
                ? "Your order has been confirmed"
                : isPending
                  ? "Please wait while we verify your payment"
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

            {isPending && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-700">
                  Your payment is being verified. This usually takes a few seconds.
                  Please do not close this page.
                </p>
              </div>
            )}

            {isFailed && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700">
                  Don't worry! Your order has been saved. You can retry the
                  payment from your orders page.
                </p>
              </div>
            )}

            {/* Countdown (only for success/failed) */}
            {!isPending && (
              <p className="text-center text-gray-500 mb-6">
                Redirecting to orders in{" "}
                <span className="font-semibold">{countdown}</span> seconds...
              </p>
            )}

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
