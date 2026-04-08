import { apiCall } from '../helpers/apicall/apiCall';

const contactSupportApi = {

    // Submit Contact Form
    submitContactForm: ({ data, setLoading, onSuccess, onError }) =>
        apiCall.post({
            route: '/contact/createContactSupport',
            payload: data,
            setLoading,
            onSuccess,
            onError,
        }),
}

export default contactSupportApi;