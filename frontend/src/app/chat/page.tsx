'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessageList } from '@/components/chat/chat-message-list';
import { ChatInput } from '@/components/chat/chat-input';

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

        const websocketUrl = `ws://192.168.29.36:8080/ws?userid=${userId}&username=${username}`;
        setConnectionStatus('Connecting...');

        if (
            ws.current &&
            (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)
        ) {
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
        ws.current.onclose = (event) =>
            setConnectionStatus(`Closed: ${event.reason || 'No reason specified'}`);

        return () => {
            if (
                ws.current?.readyState === WebSocket.OPEN ||
                ws.current?.readyState === WebSocket.CONNECTING
            ) {
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
            <div className="container mx-auto p-4">
                <h1 className="mb-4 text-2xl font-bold">Chat</h1>
                <p className="text-red-500">User ID not provided in URL. Cannot connect to chat.</p>
                <p>Please log in again or ensure the User ID is passed correctly.</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-muted">
            <Card className="flex h-[90vh] w-full max-w-2xl flex-col rounded-none border-0 shadow-lg">
                <ChatHeader room={room} />
                <div className="flex-1 overflow-hidden">
                    <ChatMessageList messages={messages} currentUserId={userId} />
                </div>
                <div className="border-t p-3">
                    <ChatInput onSendMessage={handleSendMessage} />
                </div>
                <div className="px-3 pb-2 pt-1 text-xs text-muted-foreground">
                    WebSocket Status:{' '}
                    <span
                        className={
                            connectionStatus === 'Connected'
                                ? 'text-green-500'
                                : connectionStatus === 'Connecting...'
                                    ? 'text-yellow-500'
                                    : 'text-red-500'
                        }
                    >
                                        {connectionStatus}
                                    </span>
                </div>
            </Card>
        </div>
    );
};

const Page = () => (
    <Suspense fallback={<div>Loading chat...</div>}>
        <ChatContent />
    </Suspense>
);

export default Page;