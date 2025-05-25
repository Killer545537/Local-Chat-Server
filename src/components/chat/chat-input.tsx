"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormEvent, useState } from 'react';
import { SendHorizonal } from 'lucide-react';

interface ChatInputProps {
    onSendMessageAction: (messageText: string) => void;
    isLoading?: boolean;
}

export const ChatInput = ({ onSendMessageAction, isLoading }: ChatInputProps) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSendMessageAction(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t p-4 bg-background"
        >
            <Input
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow"
                disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                <SendHorizonal className="h-4 w-4" />
                <span className="sr-only">Send message</span>
            </Button>
        </form>
    );
};