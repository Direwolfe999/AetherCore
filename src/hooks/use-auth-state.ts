'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Auth0Session } from '@/lib/auth0';
import { mockAuth0Session, mockLogin, mockLogout } from '@/lib/auth0';

export interface UseAuthStateReturn {
    session: Auth0Session | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

/**
 * useAuthState Hook
 * Manages authentication state with mock/real Auth0 integration.
 * For production, replace mock functions with actual Auth0 SDK calls.
 */
export function useAuthState(): UseAuthStateReturn {
    const [session, setSession] = useState<Auth0Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize session on mount
    useEffect(() => {
        const initializeSession = async () => {
            // Simulate checking for existing session
            await new Promise((resolve) => setTimeout(resolve, 500));
            setSession(mockAuth0Session);
            setIsLoading(false);
        };

        initializeSession();
    }, []);

    const login = useCallback(async () => {
        setIsLoading(true);
        try {
            const newSession = await mockLogin();
            setSession(newSession);
        } catch (error) {
            console.error('Login failed:', error);
            setSession(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await mockLogout();
            setSession({
                ...mockAuth0Session,
                isAuthenticated: false,
            });
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        session,
        isAuthenticated: session?.isAuthenticated ?? false,
        isLoading,
        login,
        logout,
    };
}
