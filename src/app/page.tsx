'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This is a placeholder function.
// Replace this with your actual logic to get and validate the JWT token.
const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') {
        // Example: Check for a token in localStorage
        const token = localStorage.getItem('jwt_token');
        // Add your token validation logic here if needed
        return !!token;
    }
    return false;
};

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated()) {
            // User is signed in, redirect to the chat page
            router.replace('/chat');
        } else {
            // User is not signed in, redirect to the sign-up page
            router.replace('/sign-up');
        }
    }, [router]);

    // Optionally, render a loading state or null while redirecting
    // This prevents any flash of content before the redirect happens.
    return null;
    // Or a loading component:
    // return <div>Loading...</div>;
}