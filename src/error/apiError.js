export const handleApiError = (error, defaultMessage) => {
  // Check if the error has a response with data and message
  const errorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    defaultMessage;

  console.error(`API Error: ${errorMessage}`);

  // Throw an error with the original message
  throw new Error(errorMessage);
};
