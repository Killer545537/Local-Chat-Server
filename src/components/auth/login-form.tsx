'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password cannot be empty' }), // Basic check, API handles actual auth
});

export const LoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const formData = { email, password };
        const validationResult = loginSchema.safeParse(formData);

        if (!validationResult.success) {
            const fieldErrors: Record<string, string | undefined> = {};
            validationResult.error.errors.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as string] = err.message;
                }
            });
            setErrors(fieldErrors);
            toast({ title: 'Validation Error', description: 'Please check your input.', variant: 'destructive' });
            setLoading(false);
            return;
        }

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validationResult.data),
        });

        setLoading(false);

        if (res.ok) {
            toast({ title: 'Login successful!', description: 'Welcome back.' });
            router.push('/chat');
        } else {
            const { error } = await res.json();
            toast({ title: 'Error', description: error || 'Invalid email or password', variant: 'destructive' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
            </Button>
        </form>
    );
};