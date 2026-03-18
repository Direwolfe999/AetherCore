/**
 * Auth0 Configuration & Types
 * This file contains Auth0 setup, mock authentication states,
 * and session management utilities.
 */

export type Auth0User = {
    sub: string;
    name: string;
    email: string;
    email_verified: boolean;
    picture?: string;
};

export type Auth0Session = {
    user: Auth0User | null;
    isAuthenticated: boolean;
    accessToken?: string;
};

/**
 * Mock Auth0 Session
 * Used for development and preview purposes
 */
export const mockAuth0Session: Auth0Session = {
    user: {
        sub: 'auth0|507f1f77bcf86cd799439011',
        name: 'Aether Operator',
        email: 'operator@aethercore.sovereign',
        email_verified: true,
        picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aethercore',
    },
    isAuthenticated: false,
    accessToken: 'mock_token_not_for_production',
};

/**
 * Auth0 SDK Configuration
 * Replace with actual Auth0 credentials in production
 */
export const auth0Config = {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || 'your-auth0-domain.us.auth0.com',
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || 'your_client_id_here',
    redirectUri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI || 'http://localhost:3000',
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || 'https://aethercore.sovereign',
};

/**
 * Mock login/logout functions for development
 */
export async function mockLogin(): Promise<Auth0Session> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
        ...mockAuth0Session,
        isAuthenticated: true,
    };
}

export async function mockLogout(): Promise<void> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
}
