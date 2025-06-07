import React from 'react';
import { Card } from '@/components/ui/card';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessageList } from '@/components/chat/chat-message-list';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatRoom } from '@/types/chat';

export interface Message {
    sender: { id: string; name: string };
    content: string;
    sentAt: string;
}

interface ChatPageProps {
    room: ChatRoom;
    messages: Message[];
    currentUserId: string;
    onSendMessage: (content: string) => void;
}

export const ChatPage = ({ room, messages, currentUserId, onSendMessage }: ChatPageProps) => (
    <Card className="flex h-full w-full flex-col rounded-none border-0">
        <ChatHeader room={room} />

        <div className="flex-1 overflow-hidden">
            <ChatMessageList messages={messages} currentUserId={currentUserId} />
        </div>

        <div className="border-t p-3">
            <ChatInput onSendMessage={onSendMessage} />
        </div>
    </Card>
);