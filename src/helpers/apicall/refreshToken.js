import { BASE_URL } from "../../environments";

export const refreshAccessToken = async () => {
    try {
        const userStr = localStorage.getItem("user");
        if (!userStr) throw new Error("No user data found");

        const user = JSON.parse(userStr);
        const refreshToken = user.refreshToken;

        if (!refreshToken) throw new Error("No refresh token found");

        const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${user.token}`,
            },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to refresh token");
        }

        if (data.success && data.data) {
            const updatedUser = {
                ...user,
                token: data.data.tokens.accessToken,
                refreshToken: data.data.tokens.refreshToken || user.refreshToken,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            return data.data.tokens.accessToken;
        } else {
            throw new Error("Invalid response from refresh endpoint");
        }
    } catch (error) {
        console.error("Token refresh failed:", error);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event('userLoginStatusChanged'));
        throw error;
    }
};
