'use client';

import type React from 'react';
import { useState } from 'react';
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
        <div className="p-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                <div className="flex-1 relative">
                    <Input
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="rounded-full border-border bg-input text-foreground placeholder-muted-foreground px-4 py-2.5 text-sm focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all shadow-sm"
                    />
                </div>

                <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim()}
                    className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all shadow-sm"
                >
                    <Send size={16} />
                    <span className="sr-only">Send</span>
                </Button>
            </form>
        </div>
    );
};
