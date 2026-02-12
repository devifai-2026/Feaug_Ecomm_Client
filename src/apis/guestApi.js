import { apiCall } from '../helpers/apicall/apiCall';

const guestApi = {
    // Initialize a new guest user session
    initGuestSession: ({ sessionId, referrer, setLoading, onSuccess, onError }) =>
        apiCall.post({
            route: '/guest/init',
            payload: { sessionId, referrer },
            setLoading,
            onSuccess,
            onError,
        }),

    // Track guest user activity
    trackActivity: ({ type, data, setLoading, onSuccess, onError }) =>
        apiCall.post({
            route: '/guest/track',
            payload: { type, data },
            setLoading,
            onSuccess,
            onError,
        }),

    // Track page view
    trackPageView: ({ url, setLoading, onSuccess, onError }) =>
        apiCall.post({
            route: '/guest/track',
            payload: {
                type: 'page_view',
                data: { url }
            },
            setLoading,
            onSuccess,
            onError,
        }),

    // Track product view
    trackProductView: ({ productId, setLoading, onSuccess, onError }) =>
        apiCall.post({
            route: '/guest/track',
            payload: {
                type: 'product_view',
                data: { productId }
            },
            setLoading,
            onSuccess,
            onError,
        }),

    // Track add to cart
    trackAddToCart: ({ productId, quantity, setLoading, onSuccess, onError }) =>
        apiCall.post({
            route: '/guest/track',
            payload: {
                type: 'add_to_cart',
                data: { productId, quantity }
            },
            setLoading,
            onSuccess,
            onError,
        }),

    // Get guest user details
    getGuestDetails: ({ guestId, setLoading, onSuccess, onError }) =>
        apiCall.get({
            route: `/guest/${guestId}`,
            setLoading,
            onSuccess,
            onError,
        }),

    // Utility: Get guest ID from cookie or localStorage
    getGuestId: () => {
        return localStorage.getItem('guestId') || null;
    },

    // Utility: Set guest ID
    setGuestId: (guestId) => {
        localStorage.setItem('guestId', guestId);
    },

    // Utility: Clear guest ID
    clearGuestId: () => {
        localStorage.removeItem('guestId');
    },
};

export default guestApi;
