export const buildQueryString = (params) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      query.append(key, JSON.stringify(value)); // <-- IMPORTANT
    } else if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  return query.toString();
};