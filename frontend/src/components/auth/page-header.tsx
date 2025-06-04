import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

type AuthHeaderProps = {
    type: 'login' | 'signup';
};

export const PageAuthLinks = ({ type }: AuthHeaderProps) => (
    <div className="absolute top-4 right-4 flex gap-2 md:top-8 md:right-8">
        <Link href="/about" className={cn(buttonVariants({ variant: 'ghost' }))}>
            About
        </Link>
        {type === 'login' ? (
            <Link href="/sign-up" className={cn(buttonVariants({ variant: 'ghost' }))}>
                Sign Up
            </Link>
        ) : (
            <Link href="/login" className={cn(buttonVariants({ variant: 'ghost' }))}>
                Login
            </Link>
        )}
    </div>

);