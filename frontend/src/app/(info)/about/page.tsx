import { PageLayout } from '@/components/info/page-layout';

export default function AboutPage() {
    return (
        <PageLayout>
            <main className='flex w-full flex-grow flex-col items-center justify-center py-16 lg:p-8'>
                <div className='flex w-full flex-col space-y-6 sm:w-[550px]'>
                    <div className='flex flex-col space-y-2 text-center'>
                        <h1 className='text-2xl font-semibold tracking-tight'>About Local Chat</h1>
                        <p className='text-muted-foreground text-sm'>A private and secure way to communicate</p>
                    </div>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <h2 className='text-xl font-medium'>What is Local Chat?</h2>
                            <p className='text-muted-foreground'>
                                Local Chat is a communication platform that works completely offline, using only your
                                local network. It allows you to chat with others on the same network without requiring
                                internet access, ensuring privacy and security in your communications.
                            </p>
                        </div>
                        <div className='space-y-2'>
                            <h2 className='text-xl font-medium'>Key Features</h2>
                            <ul className='text-muted-foreground list-disc space-y-1 pl-5'>
                                <li>Works without internet connection</li>
                                <li>End-to-end encryption for all messages</li>
                                <li>No data stored on external servers</li>
                                <li>Simple and intuitive interface</li>
                            </ul>
                        </div>
                        <div className='space-y-2'>
                            <h2 className='text-xl font-medium'>How It Works</h2>
                            <p className='text-muted-foreground'>
                                Local Chat uses peer-to-peer technology to establish direct connections between devices
                                on the same network. Your messages never leave your local network, providing an
                                unprecedented level of privacy and security.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </PageLayout>
    );
}
