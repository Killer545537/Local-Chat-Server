'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('/api/auth/check-status');
                if (!response.ok) {
                    console.error('Auth check failed with status:', response.status);
                    router.replace('/sign-up');
                    return;
                }

                const data = await response.json();

                if (data.isAuthenticated) {
                    router.replace('/chat');
                } else {
                    router.replace('/sign-up');
                }
            } catch (error) {
                console.error('Error checking authentication status:', error);
                router.replace('/sign-up');
            } finally {
                setIsLoading(false);
            }
        };

        void checkAuthStatus();
    }, [router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return null;
}