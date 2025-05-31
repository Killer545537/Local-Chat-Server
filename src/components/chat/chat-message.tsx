import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { Message } from '@/types/chat';

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
    const alignment = message.isOwnMessage ? 'justify-end' : 'justify-start';
    const bgColor = message.isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted';

    const senderInitial = (message.sender || 'Anonymous').substring(0, 1).toUpperCase();

    return (
        <div className={`flex items-end gap-2 ${alignment} mb-4`}>
            {!message.isOwnMessage && (
                <Avatar className="h-8 w-8">
                    <AvatarFallback>{senderInitial}</AvatarFallback>
                </Avatar>
            )}
            <div className={`max-w-[7-%] rounded-lg p-3 text-sm shadow-md ${bgColor}`}>
                <p>{message.text}</p>
            </div>
            {message.isOwnMessage && (
                <Avatar className="h-8 w-8">
                    <AvatarFallback>{senderInitial}</AvatarFallback>
                </Avatar>
            )}
        </div>
    );
};