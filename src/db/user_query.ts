import { db } from '@/db';
import bcrypt from 'bcrypt';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface CreateUserPayload {
    userName: string;
    email: string;
    password_raw: string;
}

export const createUser = async ({ userName, email, password_raw }: CreateUserPayload) => {
    console.log(`Attempting to create user with email: ${email}`);

    try {
        const hashedPassword = await bcrypt.hash(password_raw, 10);

        const [newUser] = await db.insert(users).values({
            userName,
            email,
            password: hashedPassword,
        }).returning({
            id: users.id,
            userName: users.userName,
            email: users.email,
            createdAt: users.createdAt,
        });

        console.log(`Successfully created user with id: ${newUser.id}`);
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);

        // PostgreSQL unique violation error (code 23505)
        if (error instanceof Error && 'code' in error && (error as { code: string }).code === '23505') {
            throw new Error('User with this email already exists.');
        }

        throw new Error('Failed to create user in database');
    }
};

export const getUserByEmail = async (email: string) => {
    console.log(`Attempting to fetch user by email: ${email}`);

    try {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (user) {
            console.log(`User found with email: ${email}`);
        } else {
            console.log(`No user found with email: ${email}`);
        }

        return user;
    } catch (error) {
        console.log('Error fetching user by email', error);
        throw new Error('Failed to retrieve user from database');
    }
};