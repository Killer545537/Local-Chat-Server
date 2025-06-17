'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessageList } from '@/components/chat/chat-message-list';
import { ChatInput } from '@/components/chat/chat-input';
import { config } from '@/app/config';

interface Message {
    sender: { id: string; name: string };
    content: string;
    sentAt: string;
}

const ChatContent = () => {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userid');
    const username = searchParams.get('username');
    const ws = useRef<WebSocket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const room = { name: 'Chat Room' };

    useEffect(() => {
        if (!userId || !username) {
            setConnectionStatus('User ID not provided');
            return;
        }

        const websocketUrl = `ws://${config.apiUrl}/ws?userid=${userId}&username=${username}`;
        setConnectionStatus('Connecting...');

        if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
            ws.current.close();
        }

        ws.current = new WebSocket(websocketUrl);

        ws.current.onopen = () => setConnectionStatus('Connected');
        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.id && data.content && data.username) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            sender: { id: data.id, name: data.username },
                            content: data.content,
                            sentAt: data.sentAt || new Date().toISOString(),
                        },
                    ]);
                }
            } catch {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: { id: 'system', name: 'System' },
                        content: event.data,
                        sentAt: new Date().toISOString(),
                    },
                ]);
            }
        };
        ws.current.onerror = () => setConnectionStatus('Error');
        ws.current.onclose = (event) => setConnectionStatus(`Closed: ${event.reason || 'No reason specified'}`);

        return () => {
            if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
                ws.current?.close();
            }
        };
    }, [userId, username]);

    const handleSendMessage = (content: string) => {
        if (ws.current?.readyState === WebSocket.OPEN && content.trim() !== '') {
            const message = JSON.stringify({
                id: userId,
                content,
                username,
                sentAt: new Date().toISOString(),
            });
            ws.current.send(message);
        }
    };

    if (!userId || !username) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <div className="rounded-2xl bg-card p-8 shadow-2xl border border-border">
                    <h1 className="mb-4 text-2xl font-semibold text-foreground">Chat</h1>
                    <p className="text-destructive mb-2">User ID not provided in URL. Cannot connect to chat.</p>
                    <p className="text-muted-foreground">Please log in again or ensure the User ID is passed correctly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-background p-4">
            <div className="flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl bg-card shadow-2xl border border-border overflow-hidden">
                <ChatHeader room={room} />
                <div className="flex-1 overflow-hidden">
                    <ChatMessageList messages={messages} currentUserId={userId} />
                </div>
                <div className="border-t border-border bg-card/50">
                    <ChatInput onSendMessage={handleSendMessage} />
                </div>
                <div className="px-4 pb-3 pt-2 text-xs text-muted-foreground bg-card/50 border-t border-border">
                    <div className="flex items-center justify-between">
            <span>
              Status:{' '}
                <span
                    className={
                        connectionStatus === 'Connected'
                            ? 'text-chart-2 font-medium'
                            : connectionStatus === 'Connecting...'
                                ? 'text-chart-3 font-medium'
                                : 'text-destructive font-medium'
                    }
                >
                {connectionStatus}
              </span>
            </span>
                        <span className="text-muted-foreground/70">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Page = () => (
    <Suspense
        fallback={
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <div className="rounded-2xl bg-card p-8 shadow-2xl border border-border">
                    <div className="text-muted-foreground">Loading chat...</div>
                </div>
            </div>
        }
    >
        <ChatContent />
    </Suspense>
);

export default Page;
