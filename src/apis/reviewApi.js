import { apiCall } from '../helpers/apicall/apiCall';

const reviewApi = {
  // Get product reviews (public)
  getProductReviews: ({ productId, params, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: `/reviews/product/${productId}`,
      params,
      setLoading,
      onSuccess,
      onError,
    }),

  // Get user's reviews (public)
  getUserReviews: ({ userId, params, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: `/reviews/user/${userId}`,
      params,
      setLoading,
      onSuccess,
      onError,
    }),

  // Create a review (protected)
  createReview: ({ productId, rating, title, comment, images, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/reviews',
      payload: { productId, rating, title, comment, images },
      setLoading,
      onSuccess,
      onError,
    }),

  // Update a review (protected)
  updateReview: ({ reviewId, rating, title, comment, images, setLoading, onSuccess, onError }) =>
    apiCall.patch({
      route: `/reviews/${reviewId}`,
      payload: { rating, title, comment, images },
      setLoading,
      onSuccess,
      onError,
    }),

  // Delete a review (protected)
  deleteReview: ({ reviewId, setLoading, onSuccess, onError }) =>
    apiCall.delete({
      route: `/reviews/${reviewId}`,
      setLoading,
      onSuccess,
      onError,
    }),

  // Mark review as helpful (protected)
  markHelpful: ({ reviewId, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: `/reviews/${reviewId}/helpful`,
      setLoading,
      onSuccess,
      onError,
    }),

  // Report a review (protected)
  reportReview: ({ reviewId, reason, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: `/reviews/${reviewId}/report`,
      payload: { reason },
      setLoading,
      onSuccess,
      onError,
    }),
};

export default reviewApi;
