import { Logo } from '@/components/auth/logo';

export const AuthLayoutSidePanel = () => (
    <div className="relative hidden h-full flex-col bg-muted p-10 text-white border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <Logo />
        <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
                <p className="text-lg">
                    &ldquo;This project enables offline communication using only a local network. Simple and private.&rdquo;
                </p>
                <footer className="text-sm">Srijan Mahajan</footer>
            </blockquote>
        </div>
    </div>
);