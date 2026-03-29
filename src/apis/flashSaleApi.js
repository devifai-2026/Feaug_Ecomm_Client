import { apiCall } from '../helpers/apicall/apiCall';

const flashSaleApi = {
    getActiveFlashSale: ({ setLoading, onSuccess, onError }) =>
        apiCall.get({
            route: '/flash-sale',
            setLoading,
            onSuccess,
            onError,
        }),
};

export default flashSaleApi;
