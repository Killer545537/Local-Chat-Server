import { ReactNode } from 'react';
import { PageAuthLinks, PageHeader } from '@/components/info/page-header';
import { PageFooter } from '@/components/info/page-footer';

export const PageLayout = ({ children }: { children: ReactNode }) => (
    <div className="relative container flex min-h-screen flex-col items-center lg:max-w-none lg:px-0">
        <PageHeader />
        <PageAuthLinks />
        {children}
        <PageFooter />
    </div>
);
