import { apiCall } from '../helpers/apicall/apiCall';

const bestSellerApi = {
    getBestSellerSection: ({ setLoading, onSuccess, onError }) =>
        apiCall.get({
            route: '/best-sellers',
            setLoading,
            onSuccess,
            onError,
        }),
};

export default bestSellerApi;
