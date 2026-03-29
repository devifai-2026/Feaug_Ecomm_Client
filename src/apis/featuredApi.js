import { apiCall } from '../helpers/apicall/apiCall';

const featuredApi = {
    getFeaturedSection: ({ setLoading, onSuccess, onError }) =>
        apiCall.get({
            route: '/featured',
            setLoading,
            onSuccess,
            onError,
        }),
};

export default featuredApi;
