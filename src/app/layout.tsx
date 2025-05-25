import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
    title: 'Local Chat Server',
    description: 'Talk to people on your Wi-Fi',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={'antialiased'}
        >
        <Toaster richColors position="bottom-left" />
        {children}
        </body>
        </html>
    )
        ;
}
