import { apiCall } from '../helpers/apicall/apiCall';

const wishlistApi = {
  // Get user's wishlist
  getWishlist: ({ setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/wishlist',
      setLoading,
      onSuccess,
      onError,
    }),

  // Get wishlist items count
  getWishlistCount: ({ setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/wishlist/count',
      setLoading,
      onSuccess,
      onError,
    }),

  // Check if product is in wishlist
  checkInWishlist: ({ productId, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: `/wishlist/check/${productId}`,
      setLoading,
      onSuccess,
      onError,
    }),

  // Add item to wishlist
  addToWishlist: ({ productId, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/wishlist/items',
      payload: { productId },
      setLoading,
      onSuccess,
      onError,
    }),

  // Remove item from wishlist
  removeFromWishlist: ({ productId, setLoading, onSuccess, onError }) =>
    apiCall.delete({
      route: `/wishlist/items/${productId}`,
      setLoading,
      onSuccess,
      onError,
    }),

  // Clear entire wishlist
  clearWishlist: ({ setLoading, onSuccess, onError }) =>
    apiCall.delete({
      route: '/wishlist',
      setLoading,
      onSuccess,
      onError,
    }),

  // Move wishlist item to cart
  moveToCart: ({ productId, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: `/wishlist/move-to-cart/${productId}`,
      setLoading,
      onSuccess,
      onError,
    }),
};

export default wishlistApi;
