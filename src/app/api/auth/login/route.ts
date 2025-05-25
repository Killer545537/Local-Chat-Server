import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/validations/login-schema'; // Ensure this path is correct
import { getUserByEmail } from '@/db/user_query';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in the environment. Authentication service will not function correctly.');
    // Consider throwing an error here to halt startup if JWT_SECRET is critical
    // throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
}

export const POST = async (request: NextRequest) => {
    console.log('[API /auth/login] Received POST request');

    if (!JWT_SECRET) {
        console.error('[API /auth/login] JWT_SECRET is not configured. Cannot sign tokens.');
        return NextResponse.json({ error: 'Internal server error: JWT secret not configured.' }, { status: 500 });
    }

    try {
        const body = await request.json();
        console.log('[API /auth/login] Request body received:', body); // Log the received body

        // Defensive check for loginSchema
        if (!loginSchema || typeof loginSchema.safeParse !== 'function') {
            console.error('[API /auth/login] loginSchema is not available or not a Zod schema.');
            return NextResponse.json({ error: 'Internal server error: Schema configuration issue.' }, { status: 500 });
        }

        const validationResult = loginSchema.safeParse(body);

        if (!validationResult.success) {
            // Log more detailed error information
            console.warn('[API /auth/login] Validation failed. Issues:', JSON.stringify(validationResult.error.issues, null, 2));
            console.warn('[API /auth/login] Validation failed. Formatted error:', JSON.stringify(validationResult.error.format(), null, 2));

            return NextResponse.json({
                error: 'Invalid input',
                details: validationResult.error.format(), // Send more detailed errors
            }, { status: 400 });
        }

        const { email, password } = validationResult.data;

        const user = await getUserByEmail(email);

        if (!user) {
            console.warn(`[API /auth/login] Authentication failed: User not found for email ${email}`);
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.warn(`[API /auth/login] Authentication failed: Invalid password for email ${email}`);
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const tokenPayload = {
            userId: user.id,
            email: user.email,
            userName: user.userName, // Ensure userName is part of your user model if used here
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

        console.log(`[API /auth/login] User logged in successfully: ${user.email}`);
        const { password: _, ...userWithoutPassword } = user;

        const response = NextResponse.json({
            message: 'Login successful',
            user: userWithoutPassword,
            // token: token, // Token is set in cookie, optionally remove/keep in body
        }, { status: 200 });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 60 * 60, // 1 hour in seconds
            path: '/',
            sameSite: 'lax',
        });

        return response;

    } catch (error) {
        // Check if error is due to JSON parsing
        if (error instanceof SyntaxError && error.message.toLowerCase().includes('json')) {
            console.error('[API /auth/login] Invalid JSON in request body:', error);
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }
        // Log the actual error object for better debugging
        console.error('[API /auth/login] Failed to process request:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during login.';
        return NextResponse.json({ error: 'Failed to login', details: errorMessage }, { status: 500 });
    }
};