import { ReactNode } from 'react';
import { PageHeader } from '@/components/info/page-header';
import { PageFooter } from '@/components/info/page-footer';
import { PageAuthLinks } from '@/components/auth/page-header';

type PageLayoutProps = {
    children: ReactNode;
    type: 'login' | 'signup';
};

export const PageLayout = ({ children, type }: PageLayoutProps) => (
    <div className="relative container flex min-h-screen flex-col items-center lg:max-w-none lg:px-0">
        <PageHeader />
        <PageAuthLinks type={type} />
        {children}
        <PageFooter />
    </div>
);
