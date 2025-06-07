import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (content: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
    const [input, setInput] = useState('');
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const trimmedInput = input.trim();
        if (!trimmedInput) return;

        onSendMessage(trimmedInput);
        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
            />

            <Button type="submit" size="icon" disabled={!input.trim()}>
                <Send size={18} />
                <span className="sr-only">Send</span>
            </Button>
        </form>
    );
};