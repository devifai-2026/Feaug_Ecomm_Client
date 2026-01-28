import { apiCall } from '../helpers/apicall/apiCall';

const categoryApi = {
    // Get all categories
    getAllCategories: ({ setLoading, onSuccess, onError }) =>
        apiCall.get({
            route: '/categories',
            setLoading,
            onSuccess,
            onError,
        }),

    // Get category by slug
    getCategoryBySlug: ({ slug, setLoading, onSuccess, onError }) =>
        apiCall.get({
            route: `/categories/${slug}`,
            setLoading,
            onSuccess,
            onError,
        }),

    // Get subcategories for a category
    getSubcategories: ({ categoryId, setLoading, onSuccess, onError }) =>
        apiCall.get({
            route: `/categories/${categoryId}/subcategories`,
            setLoading,
            onSuccess,
            onError,
        }),

    // Get all subcategories
    getAllSubcategories: ({ setLoading, onSuccess, onError }) =>
        apiCall.get({
            route: '/subcategories',
            setLoading,
            onSuccess,
            onError,
        }),
};

export default categoryApi;
