import React, {useEffect, useRef} from 'react';
import {ChatMessage} from '@/components/chat/chat-message';

interface Message {
    sender: { id: string; name: string };
    content: string;
    sentAt: string;
}

interface ChatMessageListProps {
    messages: Message[];
    currentUserId: string;
}

export const ChatMessageList = ({messages, currentUserId}: ChatMessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    return (
        <div className="mt-4 mb-4 flex-grow overflow-y-auto rounded border p-2 bg-gray-50">
            {messages.length === 0 && <p className="text-gray-400">No messages yet.</p>}
            {messages.map((msg, index) => (
                <ChatMessage
                    key={index}
                    message={msg}
                    isCurrentUser={msg.sender.id === currentUserId}
                />
            ))}
            <div ref={messagesEndRef}/>
        </div>
    );
};