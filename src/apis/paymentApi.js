import { apiCall } from '../helpers/apicall/apiCall';

const paymentApi = {
  // Create payment link (returns Razorpay URL to redirect user)
  createPaymentLink: ({ orderId, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/payments/create-payment-link',
      payload: { orderId },
      setLoading,
      onSuccess,
      onError,
    }),

  // Verify Razorpay payment (manual verification if needed)
  verifyPayment: ({ paymentData, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/payments/verify',
      payload: paymentData,
      setLoading,
      onSuccess,
      onError,
    }),

  // Get payment status
  getPaymentStatus: ({ orderId, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: `/payments/status/${orderId}`,
      setLoading,
      onSuccess,
      onError,
    }),
};

export default paymentApi;
