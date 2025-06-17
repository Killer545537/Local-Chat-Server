import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
    message: {
        sender: { id: string; name: string }
        content: string
        sentAt: string
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
            'flex items-end gap-2 group max-w-[85%]',
            isCurrentUser ? 'flex-row-reverse ml-auto' : 'flex-row mr-auto',
        )}
    >
        {!isCurrentUser && (
            <Avatar className="h-7 w-7 mb-1">
                <AvatarFallback className="text-xs bg-secondary text-secondary-foreground font-medium border border-border">
                    {getInitials(message.sender.name)}
                </AvatarFallback>
            </Avatar>
        )}

        <div className={cn('flex flex-col', isCurrentUser ? 'items-end' : 'items-start')}>
            {!isCurrentUser && (
                <span className="text-muted-foreground text-xs font-medium mb-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {message.sender.name}
        </span>
            )}

            <div
                className={cn(
                    'rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-lg',
                    isCurrentUser
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground rounded-br-md'
                        : 'bg-card text-card-foreground rounded-bl-md border border-border',
                )}
            >
                {message.content}
            </div>

            <span className="text-muted-foreground mt-1 text-xs px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {new Date(message.sentAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })}
      </span>
        </div>
    </div>
);
