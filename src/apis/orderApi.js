import { apiCall } from '../helpers/apicall/apiCall';

const orderApi = {
  // Get user's orders
  getUserOrders: ({ params, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/orders',
      params,
      setLoading,
      onSuccess,
      onError,
    }),

  // Get single order details
  getOrder: ({ orderId, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: `/orders/${orderId}`,
      setLoading,
      onSuccess,
      onError,
    }),

  // Track order
  trackOrder: ({ orderId, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: `/orders/${orderId}/track`,
      setLoading,
      onSuccess,
      onError,
    }),

  // Get order invoice
  getOrderInvoice: ({ orderId, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: `/orders/${orderId}/invoice`,
      setLoading,
      onSuccess,
      onError,
    }),

  // Create a new order
  createOrder: ({ orderData, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/orders',
      payload: orderData,
      setLoading,
      onSuccess,
      onError,
    }),

  // Initiate payment (get Razorpay ID without creating order)
  initiatePayment: ({ orderData, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/orders/initiate-payment',
      payload: orderData,
      setLoading,
      onSuccess,
      onError,
    }),

  // Cancel an order
  cancelOrder: ({ orderId, reason, setLoading, onSuccess, onError }) =>
    apiCall.patch({
      route: `/orders/${orderId}/cancel`,
      payload: { reason },
      setLoading,
      onSuccess,
      onError,
    }),

  // Create payment order (Razorpay)
  createPaymentOrder: ({ orderId, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: `/orders/${orderId}/create-payment`,
      setLoading,
      onSuccess,
      onError,
    }),

  // Get recent activity (public)
  getRecentActivity: ({ onSuccess, onError }) =>
    apiCall.get({
      route: '/orders/recent-activity',
      onSuccess,
      onError,
    }),

  // Get all user names for social proof notifications (public)
  getUserNames: ({ onSuccess, onError }) =>
    apiCall.get({
      route: '/orders/user-names',
      onSuccess,
      onError,
    }),
};

export default orderApi;
