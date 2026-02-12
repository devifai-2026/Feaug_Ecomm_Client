import { request } from "./request";

export const apiCall = {
  get: (config) => request("GET", config),
  post: (config) => request("POST", config),
  put: (config) => request("PUT", config),
  patch: (config) => request("PATCH", config),
  delete: (config) => request("DELETE", config),
};
