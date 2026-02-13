import axios from "axios";

function getApiBaseUrl() {
	const rawEnv = import.meta.env.VITE_API_BASE_URL
		? String(import.meta.env.VITE_API_BASE_URL).trim()
		: "";

	if (rawEnv) {
		try {
			const parsed = new URL(rawEnv);
			if (
				typeof window !== "undefined" &&
				window.location.protocol === "https:" &&
				parsed.protocol === "http:"
			) {
				console.warn(
					"VITE_API_BASE_URL uses http while page is https. Falling back to /api to avoid mixed-content."
				);
				return "/api";
			}
			return rawEnv;
		} catch (e) {
			// Not a full URL — ignore and fall back
			console.warn(
				"VITE_API_BASE_URL is not a valid URL, falling back to /api" + e
			);
		}
	}

	return "/api";
}

export const apiClient = axios.create({
	baseURL: getApiBaseUrl(),
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add JWT token to all requests
apiClient.interceptors.request.use(
	(config) => {
		// Get token from localStorage
		const authStorage = localStorage.getItem("medmanager_auth");
		if (authStorage) {
			try {
				const authData = JSON.parse(authStorage);
				if (authData.token) {
					config.headers.Authorization = `Bearer ${authData.token}`;
				}
			} catch (error) {
				console.error("Error parsing auth token:", error);
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			// Server responded with error
			console.error("API Error:", error.response.data);

			// Handle 401 Unauthorized - token expired or invalid
			if (error.response.status === 401) {
				// Clear auth data and redirect to login
				localStorage.removeItem("medmanager_auth");
				// Only redirect if not already on an auth page
				if (
					!window.location.pathname.startsWith("/login") &&
					!window.location.pathname.startsWith("/register")
				) {
					window.location.href = "/login";
				}
			}
		} else if (error.request) {
			// Request made but no response
			console.error("Network Error:", error.message);
		}
		return Promise.reject(error);
	}
);
