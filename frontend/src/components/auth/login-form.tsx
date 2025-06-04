'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React from 'react';

export const LoginForm = () => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = {
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            password: (form.elements.namedItem('password') as HTMLInputElement).value,
        };

        console.log('Sending request:', {
            url: 'http://192.168.29.36:8080/api/auth/sign_up',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
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
