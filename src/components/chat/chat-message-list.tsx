import { ScrollArea } from '@/components/ui/scroll-area'; // Assuming you have ScrollArea
import { ChatMessage } from './chat-message';
import { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';

interface ChatMessageListProps {
    messages: Message[];
}

export const ChatMessageList = ({ messages }: ChatMessageListProps) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        if (viewportRef.current) {
            viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <ScrollArea className="h-[calc(100vh-200px)] flex-grow p-4" ref={scrollAreaRef}>
            <div ref={viewportRef} className="h-full">
                {messages.length === 0 && (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No messages yet. Start the conversation!
                    </div>
                )}
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
            </div>
        </ScrollArea>
    );
};