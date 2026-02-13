import { apiClient } from "./api-client";
import type {
	RegisterRequest,
	RegisterResponse,
	LoginRequest,
	LoginResponse,
	ForgotPasswordRequest,
	ForgotPasswordResponse,
	ResetPasswordRequest,
	ResetPasswordResponse,
	VerifyEmailResponse,
	UserProfile,
	AssignRoleRequest,
	RemoveRoleRequest,
} from "@/types/auth";

const AUTH_BASE = "/auth";

/**
 * Register a new user
 */
export const register = async (
	data: RegisterRequest
): Promise<RegisterResponse> => {
	const response = await apiClient.post<RegisterResponse>(
		`${AUTH_BASE}/register`,
		data
	);
	return response.data;
};

/**
 * Verify user email with token
 */
export const verifyEmail = async (
	email: string,
	token: string
): Promise<VerifyEmailResponse> => {
	const response = await apiClient.get<VerifyEmailResponse>(
		`${AUTH_BASE}/verify-email`,
		{
			params: { email, token },
		}
	);
	return response.data;
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (
	email: string
): Promise<{ message: string }> => {
	const response = await apiClient.post<{ message: string }>(
		`${AUTH_BASE}/resend-verification`,
		{ email }
	);
	return response.data;
};

/**
 * Login user
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
	const response = await apiClient.post<LoginResponse>(
		`${AUTH_BASE}/login`,
		data
	);
	return response.data;
};

/**
 * Request password reset
 */
export const forgotPassword = async (
	data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
	const response = await apiClient.post<ForgotPasswordResponse>(
		`${AUTH_BASE}/forgot-password`,
		data
	);
	return response.data;
};

/**
 * Reset password with token
 */
export const resetPassword = async (
	data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
	const response = await apiClient.post<ResetPasswordResponse>(
		`${AUTH_BASE}/reset-password`,
		data
	);
	return response.data;
};

/**
 * Get current user profile (requires authentication)
 */
export const getCurrentUser = async (): Promise<UserProfile> => {
	const response = await apiClient.get<UserProfile>(`${AUTH_BASE}/me`);
	return response.data;
};

/**
 * Assign role to user (SuperAdmin only)
 */
export const assignRole = async (data: AssignRoleRequest): Promise<void> => {
	await apiClient.post(`${AUTH_BASE}/assign-role`, data);
};

/**
 * Remove role from user (SuperAdmin only)
 */
export const removeRole = async (data: RemoveRoleRequest): Promise<void> => {
	await apiClient.post(`${AUTH_BASE}/remove-role`, data);
};
