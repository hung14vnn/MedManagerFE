import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthUser } from '@/types/auth';
import * as authApi from '@/lib/auth';

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (
        email: string,
        password: string,
        confirmPassword: string,
        firstName: string,
        lastName: string
    ) => Promise<void>;
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'medmanager_auth';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
                if (storedAuth) {
                    const authUser = JSON.parse(storedAuth) as AuthUser;

                    // Check if token is expired
                    const expiresAt = new Date(authUser.expiresAt);
                    if (expiresAt > new Date()) {
                        setUser(authUser);
                    } else {
                        // Token expired, remove it
                        localStorage.removeItem(AUTH_STORAGE_KEY);
                    }
                }
            } catch (error) {
                console.error('Error loading auth from storage:', error);
                localStorage.removeItem(AUTH_STORAGE_KEY);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authApi.login({ email, password });
        const authUser: AuthUser = {
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            roles: response.roles,
            token: response.token,
            expiresAt: response.expiresAt,
        };

        setUser(authUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    const register = async (
        email: string,
        password: string,
        confirmPassword: string,
        firstName: string,
        lastName: string
    ) => {
        await authApi.register({
            email,
            password,
            confirmPassword,
            firstName,
            lastName,
        });
    };

    const hasRole = (role: string): boolean => {
        if (!user) return false;
        return user.roles.includes(role);
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        hasRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
