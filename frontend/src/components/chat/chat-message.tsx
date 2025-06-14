import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
    message: {
        sender: { id: string; name: string };
        content: string;
        sentAt: string;
    };
    isCurrentUser: boolean;
}

const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => (
    <div
        className={cn(
            'mb-2 flex items-start gap-2 group',
            isCurrentUser ? 'flex-row-reverse' : 'flex-row',
        )}
    >
        <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{getInitials(message.sender.name)}</AvatarFallback>
        </Avatar>

        <div className={cn('flex flex-col', isCurrentUser ? 'items-end' : 'items-start')}>
                    <span
                        className={cn(
                            'text-muted-foreground text-xs font-medium mb-1 transition-opacity duration-200',
                            'opacity-0 group-hover:opacity-100',
                            isCurrentUser && 'hidden',
                        )}
                    >
                        {message.sender.name}
                    </span>

            <div
                className={cn(
                    'max-w-[90%] rounded-lg px-3 py-2 text-sm',
                    isCurrentUser
                        ? 'bg-primary text-primary-foreground mr-4'
                        : 'bg-muted',
                )}
            >
                {message.content}
            </div>

            <span className="text-muted-foreground mt-1 text-xs">
                        {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
        </div>
    </div>
);