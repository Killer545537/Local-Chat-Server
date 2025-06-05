'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React from 'react';
import { config } from '@/app/config';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const LoginForm = () => {
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = {
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            password: (form.elements.namedItem('password') as HTMLInputElement).value,
        };

        const res = await fetch(`${config.apiUrl}/api/auth/login`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            router.push('/chat');
        } else if (res.status == 500) {
            toast.error('Internal server error. Please try later');
        } else {
            toast.error('An error occurred. Please try later');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' name='email' type='email' required autoComplete='email' />
            </div>
            <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input id='password' name='password' type='password' required autoComplete='current-password' />
            </div>
            <Button type='submit' className='w-full'>
                Log In
            </Button>
        </form>
    );
};
