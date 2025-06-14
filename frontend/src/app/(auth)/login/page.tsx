import { LoginForm } from '@/components/auth/login-form';
import { PageLayout } from '@/components/auth/page-layout';

const LoginPage = () => (
    <PageLayout type="login">
        <main className="flex w-full flex-grow flex-col items-center justify-center py-16 lg:p-8">
            <div className="flex w-full flex-col space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                    <p className="text-muted-foreground text-sm">Enter your credentials to sign in</p>
                </div>
                <LoginForm />
                <p className="text-muted-foreground px-8 text-center text-sm">
                    By signing in, you agree to our{' '}
                    <a href="/terms" className="hover:text-primary underline underline-offset-4">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="hover:text-primary underline underline-offset-4">
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>
        </main>
    </PageLayout>
);

export default LoginPage;
