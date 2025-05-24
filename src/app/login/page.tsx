import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LoginForm } from '@/components/auth/login-form';
import { MessageCircle } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="absolute right-4 top-5 md:right-8 md:top-8 flex gap-2">
                <Link
                    href="/about"
                    className={cn(buttonVariants({ variant: 'ghost' }))}>
                    About
                </Link>
                <Link
                    href="/sign-up"
                    className={cn(
                        buttonVariants({ variant: 'ghost' }),
                    )}
                >
                    Sign-Up
                </Link>
            </div>

            <div className="relative hidden h-full flex-col bg-muted p-10 text-white border-r lg:flex">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <MessageCircle className="mr-2" />
                    Local Chat
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;This project enables offline communication using only a local network. Simple and private.&rdquo;
                        </p>
                        <footer className="text-sm">Srijan Mahajan</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your credentials to sign in
                        </p>
                    </div>
                    <LoginForm />
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By signing in, you agree to our{' '}
                        <Link
                            href="/terms"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Terms of Service
                        </Link>{' '}
                        and{' '}
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
}