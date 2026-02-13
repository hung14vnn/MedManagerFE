import { apiClient } from "./api-client";
import type {
	UsersResponse,
	User,
	CreateUserRequest,
	UpdateUserRequest,
	AssignRoleRequest,
	RemoveRoleRequest,
} from "@/types/superadmin";

const SUPERADMIN_BASE = "/superadmin";

/**
 * Get paginated list of users
 */
export const getUsers = async (
	page: number = 1,
	pageSize: number = 10
): Promise<UsersResponse> => {
	const response = await apiClient.get<UsersResponse>(
		`${SUPERADMIN_BASE}/users`,
		{
			params: { page, pageSize },
		}
	);
	return response.data;
};

/**
 * Get user details by ID
 */
export const getUserById = async (id: string): Promise<User> => {
	const response = await apiClient.get<User>(`${SUPERADMIN_BASE}/users/${id}`);
	return response.data;
};

/**
 * Create a new user
 */
export const createUser = async (
	data: CreateUserRequest
): Promise<{ message: string; userId: string }> => {
	const response = await apiClient.post<{ message: string; userId: string }>(
		`${SUPERADMIN_BASE}/users`,
		data
	);
	return response.data;
};

/**
 * Update user information
 */
export const updateUser = async (
	id: string,
	data: UpdateUserRequest
): Promise<{ message: string }> => {
	const response = await apiClient.put<{ message: string }>(
		`${SUPERADMIN_BASE}/users/${id}`,
		data
	);
	return response.data;
};

/**
 * Deactivate user account
 */
export const deactivateUser = async (
	id: string
): Promise<{ message: string }> => {
	const response = await apiClient.post<{ message: string }>(
		`${SUPERADMIN_BASE}/users/${id}/deactivate`
	);
	return response.data;
};

/**
 * Activate user account
 */
export const activateUser = async (
	id: string
): Promise<{ message: string }> => {
	const response = await apiClient.post<{ message: string }>(
		`${SUPERADMIN_BASE}/users/${id}/activate`
	);
	return response.data;
};

/**
 * Assign role to user
 */
export const assignRole = async (
	id: string,
	data: AssignRoleRequest
): Promise<{ message: string }> => {
	const response = await apiClient.post<{ message: string }>(
		`${SUPERADMIN_BASE}/users/${id}/assign-role`,
		data
	);
	return response.data;
};

/**
 * Remove role from user
 */
export const removeRole = async (
	id: string,
	data: RemoveRoleRequest
): Promise<{ message: string }> => {
	const response = await apiClient.post<{ message: string }>(
		`${SUPERADMIN_BASE}/users/${id}/remove-role`,
		data
	);
	return response.data;
};

/**
 * Delete user permanently
 */
export const deleteUser = async (id: string): Promise<{ message: string }> => {
	const response = await apiClient.delete<{ message: string }>(
		`${SUPERADMIN_BASE}/users/${id}`
	);
	return response.data;
};
