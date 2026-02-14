const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

const isBrowser = typeof window !== "undefined";

const isLocalhost =
  isBrowser &&
  (LOCAL_HOSTS.has(window.location.hostname) ||
    window.location.search.includes("localhost"));

/* Shared constants */
const CLOUDINARY_BASE_URL = "https://api.cloudinary.com/v1_1/";
const CLOUD_NAME = "dysh7xusa";
const UPLOAD_PRESET = "chasmabazar";

const EMAILJS = {
  SERVICE_ID: "service_jret1xn",
  TEMPLATE_ID: "template_ekera42",
  PUBLIC_KEY: "iQE_naBgJaNNB85To",
};

/* Environment configs */
const ENV_CONFIG = {
  local: {
    BASE_URL: "http://localhost:5001/api/v1",
  },
  prod: {
    BASE_URL: "http://localhost:5001/api/v1", // Update to production URL when deploying
  },
};
const env_ = isLocalhost ? "local" : "prod";

/* Final env object */
export const env = {
  BASE_URL: ENV_CONFIG[env_].BASE_URL,

  cloudinary: CLOUDINARY_BASE_URL,
  CLOUD_NAME,
  UPLOAD_PRESET,

  EMAILJS_SERVICE_ID: EMAILJS.SERVICE_ID,
  EMAILJS_TEMPLATE_ID: EMAILJS.TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY: EMAILJS.PUBLIC_KEY,

  RAZORPAY_KEY_ID: "rzp_test_SG44kbdRqtUqN8",
};

export const BASE_URL = env.BASE_URL;
