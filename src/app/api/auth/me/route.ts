import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {db} from '@/db';
import {users} from '@/db/schema';
import {eq} from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export const GET = async () => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            console.error('[API /auth/me] JWT_SECRET is not configured.');
            return NextResponse.json({error: 'Server configuration error'}, {status: 500});
        }

        // Fix: cookies() returns a ReadonlyRequestCookies directly, not a Promise
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get('token');

        if (!tokenCookie?.value) {
            return NextResponse.json({error: 'Not authenticated'}, {status: 401});
        }

        // Decode the JWT to extract the userId
        const decoded = jwt.verify(tokenCookie.value, JWT_SECRET) as {
            userId: string;
            email: string;
            userName: string;
        };

        // Get user from database using the extracted userId
        const user = await db.query.users.findFirst({
            where: eq(users.id, decoded.userId),
        });

        if (!user) {
            return NextResponse.json({error: 'User not found'}, {status: 404});
        }

        // Remove password from the response
        const {password: _, ...safeUser} = user;

        return NextResponse.json({user: safeUser});
    } catch (error) {
        console.error('Error fetching current user:', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
};