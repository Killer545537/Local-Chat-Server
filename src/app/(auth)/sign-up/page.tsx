import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignupForm } from '@/components/auth/signup-form';
import { AuthLayoutSidePanel } from '@/components/auth/auth-layout-side-panel'; // Import the new component

const SignupPage = () => (
    <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="absolute right-4 top-5 md:right-8 md:top-8 flex gap-2">
            <Link
                href="/about"
                className={cn(buttonVariants({ variant: 'ghost' }))}>
                About
            </Link>
            <Link
                href="/login"
                className={cn(
                    buttonVariants({ variant: 'ghost' }),
                )}
            >
                Login
            </Link>
        </div>

        <AuthLayoutSidePanel />

        <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your details to register
                    </p>
                </div>
                <SignupForm />
                <p className="px-8 text-center text-sm text-muted-foreground">
                    By signing up, you agree to our {' '}
                    <Link
                        href="/terms"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Terms of Service
                    </Link>{' '}
                    and {' '}
                    <Link
                        href="/privacy"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    </div>
);

export default SignupPage;