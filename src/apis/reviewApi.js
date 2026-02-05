import { apiCall } from '../helpers/apicall/apiCall';

const reviewApi = {
  // Create a new review
  createReview: ({ data, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: '/reviews',
      payload: data,
      setLoading,
      onSuccess,
      onError,
    }),

  // Get reviews for a product (already in productApi but good to have here too)
  getProductReviews: ({ productId, params, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: `/reviews/product/${productId}`,
      params,
      setLoading,
      onSuccess,
      onError,
    }),

  // Mark a review as helpful
  markHelpful: ({ reviewId, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: `/reviews/${reviewId}/helpful`,
      setLoading,
      onSuccess,
      onError,
    }),

  // Report a review
  reportReview: ({ reviewId, data, setLoading, onSuccess, onError }) =>
    apiCall.post({
      route: `/reviews/${reviewId}/report`,
      payload: data,
      setLoading,
      onSuccess,
      onError,
    }),
};

export default reviewApi;
