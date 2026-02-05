import { apiCall } from '../helpers/apicall/apiCall';

const cartApi = {
  // Get user's cart
  getCart: ({ setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/cart',
      setLoading,
      onSuccess,
      onError,
    }),

  // Get cart items count
  getCartCount: ({ setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/cart/count',
      setLoading,
      onSuccess,
      onError,
    }),

  // Check cart stock availability
  checkCartStock: ({ setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/cart/check-stock',
      setLoading,
      onSuccess,
      onError,
    }),

  // Add item to cart
  addToCart: ({ productId, quantity = 1, variant, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/cart/items',
      payload: { productId, quantity, variant },
      setLoading,
      onSuccess,
      onError,
    }),

  // Update cart item quantity
  updateCartItem: ({ itemId, quantity, setLoading, onSuccess, onError }) =>
    apiCall.patch({
      route: `/cart/items/${itemId}`,
      payload: { quantity },
      setLoading,
      onSuccess,
      onError,
    }),

  // Remove item from cart
  removeCartItem: ({ itemId, setLoading, onSuccess, onError }) =>
    apiCall.delete({
      route: `/cart/items/${itemId}`,
      setLoading,
      onSuccess,
      onError,
    }),

  // Clear entire cart
  clearCart: ({ setLoading, onSuccess, onError }) =>
    apiCall.delete({
      route: '/cart',
      setLoading,
      onSuccess,
      onError,
    }),

  // Apply coupon to cart
  applyCoupon: ({ couponCode, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/cart/apply-coupon',
      payload: { couponCode },
      setLoading,
      onSuccess,
      onError,
    }),

  // Remove coupon from cart
  removeCoupon: ({ setLoading, onSuccess, onError }) =>
    apiCall.delete({
      route: '/cart/remove-coupon',
      setLoading,
      onSuccess,
      onError,
    }),
  
  // New Promo Codes (simplified)
  getPromoCodes: ({ setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/promo-codes',
      setLoading,
      onSuccess,
      onError,
    }),

  applyPromoCode: ({ code, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/promo-codes/validate',
      payload: { code },
      setLoading,
      onSuccess,
      onError,
    }),
};

export default cartApi;
