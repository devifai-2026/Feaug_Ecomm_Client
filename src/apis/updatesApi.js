import { apiCall } from '../helpers/apicall/apiCall';

const updatesApi = {
    /**
     * Get active updates for display on frontend
     * @param {Object} params - { setLoading, onSuccess, onError }
     */
    getActiveUpdates: ({ setLoading, onSuccess, onError }) =>
        apiCall.get({
            route: '/updates',
            setLoading,
            onSuccess,
            onError,
        }),
};

export default updatesApi;
