import axios from "axios";
import { BASE_URL } from "../../environments";
import { getHeaders } from "./headers";

export const request = async (
  method,
  {
    route,
    payload = null,
    params = null,
    setLoading = null,
    onSuccess = null,
    onError = null,
    afterCall = null,
  }
) => {
  if (setLoading) setLoading(true);

  try {
    const headers = getHeaders();
    const isExternal =
      route.startsWith("http://") || route.startsWith("https://");

    const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
    const url = isExternal ? route : `${BASE_URL}${normalizedRoute}`;

    const options = {
      method,
      url,
      headers,
      params,
      paramsSerializer: {
        serialize: (params) => {
          const parts = [];
          Object.keys(params).forEach((key) => {
            const value = params[key];
            if (Array.isArray(value)) {
              // Format arrays as key=['value1','value2']
              const quotedValues = value.map(v => `'${v}'`).join(',');
              parts.push(`${key}=[${quotedValues}]`);
            } else if (value !== null && value !== undefined) {
              parts.push(`${key}=${encodeURIComponent(value)}`);
            }
          });
          return parts.join('&');
        }
      },
      ...(payload ? { data: payload } : {}),
    };

    if (payload instanceof FormData) {
      delete options.headers["Content-Type"];
    }

    const response = await axios(options);

    // Normalize response to add 'success' field for backward compatibility
    // Backend returns { status: 'success', ... } but frontend expects { success: true, ... }
    const normalizedData = {
      ...response.data,
      success: response.data.status === 'success'
    };

    if (onSuccess) onSuccess(normalizedData);
    return normalizedData;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || error.response?.statusCode;
      const originalRequest = error.config;
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { refreshAccessToken } = await import("./refreshToken");
          const newToken = await refreshAccessToken();
          originalRequest.headers["authorization"] = `Bearer ${newToken}`;
          const retryResponse = await axios(originalRequest);

          // Normalize retry response as well
          const normalizedRetryData = {
            ...retryResponse.data,
            success: retryResponse.data.status === 'success'
          };

          if (onSuccess) onSuccess(normalizedRetryData);
          return normalizedRetryData;

        } catch (refreshError) {
          const sessionExpiredError = new Error("Session expired. Please login again.");
          if (onError) onError(sessionExpiredError);
          else throw sessionExpiredError;
          return;
        }
      }

      console.error(`API Error (${method} ${route}):`, error.response?.data || error.message);
      if (onError) onError(error.response || error);
      else throw error;

    } else {
      console.error(`Unexpected Error (${method} ${route}):`, error);
      if (onError) onError(error);
      else throw error;
    }
  } finally {
    if (setLoading) setLoading(false);
    if (afterCall) afterCall();
  }
};