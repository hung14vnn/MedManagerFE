import axios from "axios";

// Use VITE_API_BASE_URL when provided, otherwise default to a same-origin path '/api'.
// If VITE_API_BASE_URL is an http:// URL while the page is loaded over https://,
// using it directly will cause mixed-content errors. In that case we fallback
// to '/api' (same-origin) and log a warning so the developer can update the env
// or enable TLS on the backend.
const rawEnv = import.meta.env.VITE_API_BASE_URL
	? import.meta.env.VITE_API_BASE_URL.trim()
	: "";

function getApiBaseUrl() {
	// Force same-origin proxy for now (applies to all environments).
	// This ensures the browser never makes http:// calls directly (avoids mixed-content).
	// eslint-disable-next-line no-console
	console.info(
		"Forcing '/api' base URL to use same-origin proxy (forced by developer)."
	);
	return "/api";
}

export const apiClient = axios.create({
	baseURL: getApiBaseUrl(),
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			// Server responded with error
			console.error("API Error:", error.response.data);
		} else if (error.request) {
			// Request made but no response
			console.error("Network Error:", error.message);
		}
		return Promise.reject(error);
	}
);
