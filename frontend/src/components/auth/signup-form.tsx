'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React from 'react';
import { config } from '@/app/config';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const SignupForm = () => {
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            password: (form.elements.namedItem('password') as HTMLInputElement).value,
        };

        const res = await fetch(`${config.apiUrl}/api/auth/sign_up`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            router.push('/login');
        } else if (res.status === 409) {
            toast.error('User already exists');
        } else if (res.status === 500) {
            toast.error('Internal server error. Please try again later');
        } else {
            toast.error('An error occurred. Please try again later');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                    id="userName"
                    name="name"
                    type="text"
                    required
                    minLength={3}
                    maxLength={50}
                    autoComplete="username"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                />
            </div>
            <Button type="submit" className="w-full">
                Sign Up
            </Button>
        </form>
    );
};
