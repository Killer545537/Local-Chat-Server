'use client';

import { useCallback, useState } from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessageList } from '@/components/chat/chat-message-list';
import { ChatInput } from '@/components/chat/chat-input';
import { Message } from '@/types/chat';

// Define types used in this component (can be moved to a types file)
interface CurrentUser {
    id: string;
    userName: string;
}

// Sample Data
const sampleCurrentUser: CurrentUser = {
    id: 'user-123',
    userName: 'SampleUser',
};

const initialSampleMessages: Message[] = [
    {
        id: 'msg-1',
        text: 'Hello there!',
        sender: 'OtherUser',
        isOwnMessage: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
        id: 'msg-2',
        text: 'Hi! How are you?',
        sender: sampleCurrentUser.userName,
        isOwnMessage: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
    },
    {
        id: 'msg-3',
        text: 'I am good, thanks for asking! This is a sample chat.',
        sender: 'OtherUser',
        isOwnMessage: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
    },
];

export default function ChatPage() {
    const [currentUser] = useState<CurrentUser | null>(sampleCurrentUser);
    const [messages, setMessages] = useState<Message[]>(initialSampleMessages);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    // For design purposes, userCount can be static or based on sample data
    const [userCount] = useState(2); // Example: current user + one other

    const handleSendMessage = useCallback((messageText: string) => {
        if (!currentUser) {
            console.error('No current user to send message');
            return;
        }
        if (!messageText.trim()) {
            return;
        }

        setIsSendingMessage(true);
        // Simulate sending a message
        console.log('[ChatPage] Simulating sending message:', messageText);

        const newMessage: Message = {
            id: `msg-${Date.now()}`, // Simple unique ID for sample
            text: messageText,
            sender: currentUser.userName,
            isOwnMessage: true,
            timestamp: new Date(),
        };

        // Simulate a slight delay for "sending"
        setTimeout(() => {
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setIsSendingMessage(false);
            console.log('[ChatPage] Sample message added to list.');
        }, 500); // 0.5 second delay

    }, [currentUser]);

    if (!currentUser) {
        // This case should ideally not be hit with static sample data
        // but good practice to keep for robustness if currentUser logic changes
        return (
            <div className="flex flex-col h-screen bg-muted/50 items-center justify-center p-4 text-center">
                <p className="text-lg text-destructive mb-4">User data not available.</p>
                <p className="text-muted-foreground mb-6">
                    Cannot display chat page without user information.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-muted/50">
            <ChatHeader name={currentUser.userName ? `${currentUser.userName}'s Chat Room` : 'Sample Chat Room'} userCount={userCount} />

            <div className="flex-grow flex flex-col overflow-hidden">
                <ChatMessageList messages={messages} />
            </div>

            <ChatInput
                onSendMessageAction={handleSendMessage}
                isLoading={isSendingMessage}
            />
        </div>
    );
}