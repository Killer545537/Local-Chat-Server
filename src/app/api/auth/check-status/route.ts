import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

export const GET = async (_request: NextRequest) => {
    if (!JWT_SECRET) {
        console.error('[API /auth/check-status] JWT_SECRET is not configured.');
        return NextResponse.json({ isAuthenticated: false, error: 'Configuration error' }, { status: 500 });
    }

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');

    if (!tokenCookie || !tokenCookie.value) {
        return NextResponse.json({ isAuthenticated: false });
    }

    try {
        jwt.verify(tokenCookie.value, JWT_SECRET);
        return NextResponse.json({ isAuthenticated: true });
    } catch (error) {
        let errorMessage = 'Token verification failed';
        let logMessage = 'Unknown error during token verification';

        if (error instanceof jwt.TokenExpiredError) {
            errorMessage = 'Token expired';
            logMessage = error.message;
        } else if (error instanceof jwt.JsonWebTokenError) {
            errorMessage = 'Invalid token';
            logMessage = error.message;
        } else if (error instanceof Error) {
            // Handle other generic errors
            logMessage = error.message;
        }

        console.warn(`[API /auth/check-status] ${errorMessage}:`, logMessage);

        const response = NextResponse.json({ isAuthenticated: false, error: errorMessage });
        response.cookies.set('token', '', { httpOnly: true, path: '/', maxAge: -1 }); // Clear cookie
        return response;
    }
};