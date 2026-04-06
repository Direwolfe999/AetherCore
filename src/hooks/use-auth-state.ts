'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

export interface UseAuthStateReturn {
    session: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
}

/**
 * useAuthState Hook
 * Manages authentication state using Auth0 NextJS SDK
 */
export function useAuthState(): UseAuthStateReturn {
    const { user, error, isLoading } = useUser();

    const login = () => {
        window.location.href = '/auth/login';
    };

    const logout = () => {
        window.location.href = '/auth/logout';
    };

    return {
        session: user ? { user, isAuthenticated: true } : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    };
}
