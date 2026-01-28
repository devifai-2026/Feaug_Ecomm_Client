import { apiCall } from '../helpers/apicall/apiCall';

const addressApi = {
    // Get all user addresses
    getAddresses: ({ setLoading, onSuccess, onError }) =>
        apiCall.get({
            route: '/users/addresses',
            setLoading,
            onSuccess,
            onError,
        }),

    // Add a new address
    addAddress: ({ addressData, setLoading, onSuccess, onError }) =>
        apiCall.post({
            route: '/users/addresses',
            payload: addressData,
            setLoading,
            onSuccess,
            onError,
        }),

    // Update an existing address
    updateAddress: ({ addressId, addressData, setLoading, onSuccess, onError }) =>
        apiCall.patch({
            route: `/users/addresses/${addressId}`,
            payload: addressData,
            setLoading,
            onSuccess,
            onError,
        }),

    // Delete an address
    deleteAddress: ({ addressId, setLoading, onSuccess, onError }) =>
        apiCall.delete({
            route: `/users/addresses/${addressId}`,
            setLoading,
            onSuccess,
            onError,
        }),

    // Set an address as default
    setDefaultAddress: ({ addressId, setLoading, onSuccess, onError }) =>
        apiCall.patch({
            route: `/users/addresses/${addressId}/set-default`,
            setLoading,
            onSuccess,
            onError,
        }),
};

export default addressApi;
