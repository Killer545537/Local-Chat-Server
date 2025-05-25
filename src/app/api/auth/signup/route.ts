import { NextRequest, NextResponse } from 'next/server';
import { signupSchema } from '@/validations/signup-schema';
import { createUser } from '@/db/user_query';

export const POST = async (request: NextRequest) => {
    console.log(`Received POST request`);

    try {
        const body = await request.json();

        const validationResult = signupSchema.safeParse(body);

        if (!validationResult.success) {
            console.warn('Validation failed', validationResult.error.flatten().fieldErrors);
            return NextResponse.json({ error: 'Invalid input', details: validationResult.error.flatten().fieldErrors }, { status: 400 });
        }

        const { userName, email, password } = validationResult.data;

        const newUser = await createUser({ userName, email, password_raw: password });
        console.log(`User created successfully: ${newUser.email}`);

        return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.log('Invalid JSON in request body:', error);
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }

        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        console.error('Failed to process request', errorMessage);

        if (errorMessage === 'User with this email already exists.') {
            return NextResponse.json({ error: errorMessage }, { status: 409 });
        }

        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
};