// SuperAdmin User Management Types

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	emailConfirmed: boolean;
	isActive: boolean;
	createdAt: string;
	lastLoginAt: string | null;
	roles: string[];
}

export interface UsersResponse {
	users: User[];
	pagination: {
		currentPage: number;
		pageSize: number;
		totalUsers: number;
		totalPages: number;
	};
}

export interface CreateUserRequest {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: "SuperAdmin" | "Admin" | "User";
}

export interface UpdateUserRequest {
	firstName: string;
	lastName: string;
	isActive: boolean;
}

export interface AssignRoleRequest {
	email: string;
	role: string;
}

export interface RemoveRoleRequest {
	email: string;
	role: string;
}
