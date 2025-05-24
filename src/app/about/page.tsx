import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Github, Linkedin, MessageCircle } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="container relative min-h-screen flex flex-col items-center lg:max-w-none lg:px-0">
            <div className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center text-lg font-medium">
                <MessageCircle className="mr-2" />
                Local Chat
            </div>

            <div className="absolute right-4 top-4 md:right-8 md:top-8 flex gap-2">
                <Link
                    href="/sign-up"
                    className={cn(
                        buttonVariants({ variant: 'ghost' }),
                    )}
                >
                    Sign Up
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

            {/* Main content area: grows to fill space and centers its content */}
            <main className="flex-grow flex flex-col justify-center items-center w-full py-16 lg:p-8">
                {/* Content block: width constrained, centered by parent */}
                <div className="w-full flex flex-col space-y-6 sm:w-[550px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            About Local Chat
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            A private and secure way to communicate
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-xl font-medium">What is Local Chat?</h2>
                            <p className="text-muted-foreground">
                                Local Chat is a communication platform that works completely offline, using only your local network.
                                It allows you to chat with others on the same network without requiring internet access,
                                ensuring privacy and security in your communications.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-medium">Key Features</h2>
                            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                                <li>Works without internet connection</li>
                                <li>End-to-end encryption for all messages</li>
                                <li>No data stored on external servers</li>
                                <li>Simple and intuitive interface</li>
                                <li>Support for text, images, and files</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-medium">How It Works</h2>
                            <p className="text-muted-foreground">
                                Local Chat uses peer-to-peer technology to establish direct connections between devices
                                on the same network. Your messages never leave your local network, providing an
                                unprecedented level of privacy and security.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full py-4 mt-auto border-t">
                <div className="container flex justify-center gap-6">
                    <Link
                        href="https://github.com/Killer545537"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                        <Github className="h-5 w-5" />
                        GitHub
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/srijan-mahajan-035680294/" // Remember to update this link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                        <Linkedin className="h-5 w-5" />
                        LinkedIn
                    </Link>
                </div>
            </footer>
        </div>
    );
}