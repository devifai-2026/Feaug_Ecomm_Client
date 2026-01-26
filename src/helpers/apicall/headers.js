export const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };

  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.token) headers["authorization"] = `Bearer ${user.token}`;
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  return headers;
};
