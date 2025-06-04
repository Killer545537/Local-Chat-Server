import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export const PageHeader = () => (
    <div className='absolute top-4 left-4 flex items-center text-lg font-medium md:top-8 md:left-8'>
        <MessageCircle className='mr-2' />
        Local Chat
    </div>
);

export const PageAuthLinks = () => (
    <div className='absolute top-4 right-4 flex gap-2 md:top-8 md:right-8'>
        <Link href='/sign-up' className={cn(buttonVariants({ variant: 'ghost' }))}>
            Sign Up
        </Link>
        <Link href='/login' className={cn(buttonVariants({ variant: 'ghost' }))}>
            Login
        </Link>
    </div>
);
