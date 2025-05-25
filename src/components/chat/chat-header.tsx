import { MessageSquareText, Users } from 'lucide-react';

interface ChatHeaderProps {
    name: string;
    userCount: number;
}

export const ChatHeader = ({ name, userCount }: ChatHeaderProps) => (
    <div className="flex items-center justify-between border-b p-4 bg-background">
        <div className="flex items-center gap-3">
            <MessageSquareText className="h-6 w-6 text-primary" />
            <div>
                <h2 className="font-semibold text-lg">{name}</h2>
            </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{userCount} user(s) online</span>
        </div>
    </div>
);