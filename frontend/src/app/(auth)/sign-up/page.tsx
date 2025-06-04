import { SignupForm } from '@/components/auth/signup-form';
import { PageLayout } from '@/components/auth/page-layout';

const SignupPage = () => (
    <PageLayout type='signup'>
        <main className='flex w-full flex-grow flex-col items-center justify-center py-16 lg:p-8'>
            <div className='flex w-full flex-col space-y-6 sm:w-[350px]'>
                <div className='flex flex-col space-y-2 text-center'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Create your account</h1>
                    <p className='text-muted-foreground text-sm'>Enter your details to sign up</p>
                </div>
                <SignupForm />
                <p className='text-muted-foreground px-8 text-center text-sm'>
                    By signing up, you agree to our{' '}
                    <a href='/terms' className='hover:text-primary underline underline-offset-4'>
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href='/privacy' className='hover:text-primary underline underline-offset-4'>
                        Privacy Policy
                    </a>
                    .
                </p>
                <p className='text-muted-foreground px-8 text-center text-sm'>
                    Already have an account?{' '}
                    <a href='/login' className='hover:text-primary underline underline-offset-4'>
                        Log in
                    </a>
                </p>
            </div>
        </main>
    </PageLayout>
);

export default SignupPage;
