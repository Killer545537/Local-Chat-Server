export interface Message {
    id: string;
    text: string;
    sender: string;
    isOwnMessage: boolean;
    timestamp: Date;
}
