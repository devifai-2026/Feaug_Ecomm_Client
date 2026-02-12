import { apiCall } from '../helpers/apicall/apiCall';

const productApi = {
  // Get all products with pagination and filters
  getAllProducts: ({ params, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/products',
      params,
      setLoading,
      onSuccess,
      onError,
    }),

  // Search products
  searchProducts: ({ query, params, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/products/search',
      params: { q: query, ...params },
      setLoading,
      onSuccess,
      onError,
    }),

  // Get featured products
  getFeaturedProducts: ({ params, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/products/featured',
      params,
      setLoading,
      onSuccess,
      onError,
    }),

  // Get new arrivals
  getNewArrivals: ({ params, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/products/new-arrivals',
      params,
      setLoading,
      onSuccess,
      onError,
    }),

  // Get best sellers
  getBestSellers: ({ params, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/products/best-sellers',
      params,
      setLoading,
      onSuccess,
      onError,
    }),

  // Get products on sale
  getProductsOnSale: ({ params, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/products/on-sale',
      params,
      setLoading,
      onSuccess,
      onError,
    }),

  // Get products by category
  getProductsByCategory: ({ categorySlug, params, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: `/products/category/${categorySlug}`,
      params,
      setLoading,
      onSuccess,
      onError,
    }),

  // Get product filters
  getProductFilters: ({ setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/products/filters',
      setLoading,
      onSuccess,
      onError,
    }),

  // Get single product by ID
  getProduct: ({ productId, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: `/products/${productId}`,
      setLoading,
      onSuccess,
      onError,
    }),

  // Get similar products
  getSimilarProducts: ({ productId, params, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: `/products/${productId}/similar`,
      params,
      setLoading,
      onSuccess,
      onError,
    }),

  // Get product reviews
  getProductReviews: ({ productId, params, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: `/products/${productId}/reviews`,
      params,
      setLoading,
      onSuccess,
      onError,
    }),

  // Alias for getProductsOnSale (for backward compatibility)
  getOnSaleProducts: ({ params, setLoading, onSuccess, onError }) =>
    apiCall.get({
      route: '/products/on-sale',
      params,
      setLoading,
      onSuccess,
      onError,
    }),
};

export default productApi;
