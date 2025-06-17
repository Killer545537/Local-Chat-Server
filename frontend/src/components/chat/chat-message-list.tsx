'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/components/chat/chat-message';

interface Message {
    sender: { id: string; name: string };
    content: string;
    sentAt: string;
}

interface ChatMessageListProps {
    messages: Message[];
    currentUserId: string;
}

export const ChatMessageList = ({ messages, currentUserId }: ChatMessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-grow overflow-y-auto px-4 py-4 bg-background custom-scrollbar">
            {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-sm">No messages yet. Start the conversation!</p>
                </div>
            )}
            <div className="space-y-3">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} isCurrentUser={msg.sender.id === currentUserId} />
                ))}
            </div>
            <div ref={messagesEndRef} />
        </div>
    );
};
