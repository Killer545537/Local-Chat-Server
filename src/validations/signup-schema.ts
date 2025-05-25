import {z} from 'zod'

export const signupSchema = z.object({
    userName: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});
