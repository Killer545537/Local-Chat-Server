export interface Message {
    id: string;
    text: string;
    sender: string;
    senderId: string;
    isOwnMessage?: boolean;
    timestamp: Date;
}
