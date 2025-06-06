'use client';

import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useRef, useState } from 'react';

const ChatContent = () => {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userid');
    const username = searchParams.get('username');
    const ws = useRef<WebSocket | null>(null);
    const [messages, setMessages] = useState<{
        username: string; id: string; content: string
    }[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');

    useEffect(() => {
        if (userId) {
            console.log('userId:', userId);
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
                    if (data.id && data.content) {
                        setMessages((prev) => [...prev, { username: data.username, id: data.id, content: data.content }]);
                    }
                } catch {
                    // Fallback for non-JSON messages
                    setMessages((prev) => [...prev, { username: 'System', id: 'system', content: event.data }]);
                }
            };
            ws.current.onerror = () => setConnectionStatus('Error');
            ws.current.onclose = (event) => setConnectionStatus(`Closed: ${event.reason || 'No reason specified'}`);

            return () => {
                if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
                    ws.current?.close();
                }
            };
        } else {
            setConnectionStatus('User ID not provided');
        }
    }, [userId, username]);

    const handleSendMessage = () => {
        if (ws.current?.readyState === WebSocket.OPEN && inputValue.trim() !== '') {
            const message = JSON.stringify({
                id: userId,
                content: inputValue,
                username: username,
            });
            ws.current.send(message);
            setInputValue('');
        } else {
            alert('WebSocket is not connected or message is empty.');
        }
    };

    if (!userId) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="mb-4 text-2xl font-bold">Chat</h1>
                <p className="text-red-500">User ID not provided in URL. Cannot connect to chat.</p>
                <p>Please log in again or ensure the User ID is passed correctly.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto flex h-screen flex-col p-4">
            <h1 className="mb-4 text-2xl font-bold">Chat Room</h1>
            <p>User ID: {userId}</p>
            <p>
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
            </p>
            <div className="mt-4 mb-4 flex-grow overflow-y-auto rounded border p-2 bg-gray-50">
                {messages.length === 0 && <p className="text-gray-400">No messages yet.</p>}
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className="my-2 rounded-lg bg-blue-100 px-3 py-2 shadow-sm"
                    >
                        <span className="font-semibold text-blue-700">{msg.username}:</span>
                        <span className="ml-2 text-gray-800">{msg.content}</span>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-grow rounded border p-2"
                    placeholder="Type a message..."
                    disabled={connectionStatus !== 'Connected'}
                />
                <button
                    onClick={handleSendMessage}
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={connectionStatus !== 'Connected'}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

const Page = () => (
    <Suspense fallback={<div>Loading chat...</div>}>
        <ChatContent />
    </Suspense>
);

export default Page;
