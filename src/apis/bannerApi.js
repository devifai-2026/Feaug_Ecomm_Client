import { apiCall } from '../helpers/apicall/apiCall';

const bannerApi = {
    /**
     * Get banners for a specific page
     * @param {Object} params - { page, position, bannerType, setLoading, onSuccess, onError }
     */
    getBannersByPage: ({ page, position, bannerType, setLoading, onSuccess, onError }) => {
        const params = {};
        if (position) params.position = position;
        if (bannerType) params.bannerType = bannerType;

        return apiCall.get({
            route: `/banners/page/${page}`,
            params,
            setLoading,
            onSuccess,
            onError,
        });
    },

    /**
     * Get banner by name
     * @param {Object} params - { name, setLoading, onSuccess, onError }
     */
    getBannerByName: ({ name, setLoading, onSuccess, onError }) => {
        return apiCall.get({
            route: `/banners/name/${name}`,
            setLoading,
            onSuccess,
            onError,
        });
    },

    /**
     * Get all active banners
     * @param {Object} params - { page, position, bannerType, limit, setLoading, onSuccess, onError }
     */
    getActiveBanners: ({ page, position, bannerType, limit, setLoading, onSuccess, onError }) => {
        const params = {};
        if (page) params.page = page;
        if (position) params.position = position;
        if (bannerType) params.bannerType = bannerType;
        if (limit) params.limit = limit;

        return apiCall.get({
            route: '/banners/active',
            params,
            setLoading,
            onSuccess,
            onError,
        });
    },
};

export default bannerApi;
