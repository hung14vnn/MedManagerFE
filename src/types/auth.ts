// Authentication related types

export interface RegisterRequest {
	email: string;
	password: string;
	confirmPassword: string;
	firstName: string;
	lastName: string;
}

export interface RegisterResponse {
	message: string;
	email: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	email: string;
	firstName: string;
	lastName: string;
	roles: string[];
	expiresAt: string;
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ForgotPasswordResponse {
	message: string;
}

export interface ResetPasswordRequest {
	email: string;
	token: string;
	newPassword: string;
	confirmPassword: string;
}

export interface ResetPasswordResponse {
	message: string;
}

export interface VerifyEmailRequest {
	email: string;
	token: string;
}

export interface VerifyEmailResponse {
	message: string;
}

export interface UserProfile {
	email: string;
	firstName: string;
	lastName: string;
	roles: string[];
}

export interface AssignRoleRequest {
	email: string;
	role: string;
}

export interface RemoveRoleRequest {
	email: string;
	role: string;
}

export interface AuthUser {
	email: string;
	firstName: string;
	lastName: string;
	roles: string[];
	token: string;
	expiresAt: string;
}
