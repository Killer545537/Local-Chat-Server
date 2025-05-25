'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessageList } from '@/components/chat/chat-message-list';
import { ChatInput } from '@/components/chat/chat-input';
import { Message } from '@/types/chat';

// TODO: Replace with actual user identification logic.
// This might involve an API call to get current user details based on the session/token.
const MOCK_USER_ID = 'currentUser123'; // Placeholder for the current user's ID
const MOCK_USER_NAME = 'You'; // Placeholder for the current user's display name

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [userCount, setUserCount] = useState(1); // Placeholder, update with real logic

    // Fetch initial messages
    const fetchMessages = useCallback(async () => {
        setIsLoadingMessages(true);
        try {
            // Fetch last 50 messages, or adjust as needed
            const response = await fetch('/api/messages?limit=50');
            if (!response.ok) {
                console.error('Failed to fetch messages:', response.status, await response.text());
                setMessages([]);
                return;
            }
            const data = await response.json();
            if (!data.messages || !Array.isArray(data.messages)) {
                console.error('Fetched data does not contain an array of messages:', data);
                setMessages([]);
                return;
            }

            const transformedMessages = data.messages.map((msg: any) => ({
                id: msg.id,
                text: msg.content,
                // TODO: Replace with actual sender name resolution if sender_id is not the display name
                sender: msg.sender_id === MOCK_USER_ID ? MOCK_USER_NAME : `User ${String(msg.sender_id).substring(0, 6)}`,
                isOwnMessage: msg.sender_id === MOCK_USER_ID,
                timestamp: msg.created_at,
            })).sort((a: Message, b: Message) =>
                new Date(a.timestamp as string).getTime() - new Date(b.timestamp as string).getTime(),
            ); // Sort by timestamp ascending

            setMessages(transformedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } finally {
            setIsLoadingMessages(false);
        }
    }, []); // MOCK_USER_ID and MOCK_USER_NAME are stable

    useEffect(() => {
        void fetchMessages();
        // TODO: Implement logic to fetch and update userCount (e.g., via WebSockets or polling)
        // For example, you might set up a WebSocket connection here to listen for user count changes.
    }, [fetchMessages]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim()) return;

        setIsSendingMessage(true);
        const optimisticMessage: Message = {
            id: `temp-${Date.now()}`,
            text: messageText,
            sender: MOCK_USER_NAME,
            isOwnMessage: true,
            timestamp: new Date().toISOString(),
        };

        setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderId: MOCK_USER_ID, // This should ideally be derived from the authenticated session on the backend
                    content: messageText,
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Failed to send message:', response.status, errorData);
                setMessages((prevMessages) =>
                    prevMessages.filter((msg) => msg.id !== optimisticMessage.id),
                );
                // TODO: Optionally, show a toast notification for the error
                return;
            }

            const newMessageData = await response.json();
            if (!newMessageData.data || !newMessageData.data.id) {
                console.error('Invalid response from server after sending message:', newMessageData);
                // Revert optimistic update as we don't have a valid message
                setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== optimisticMessage.id));
                return;
            }

            const confirmedMessage: Message = {
                id: newMessageData.data.id,
                text: newMessageData.data.content,
                sender: MOCK_USER_NAME, // Assuming the sender is the current user
                isOwnMessage: true,
                timestamp: newMessageData.data.created_at,
            };

            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === optimisticMessage.id ? confirmedMessage : msg,
                ),
            );
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prevMessages) =>
                prevMessages.filter((msg) => msg.id !== optimisticMessage.id),
            );
            // TODO: Optionally, show a toast notification for the error
        } finally {
            setIsSendingMessage(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-muted/50">
            <ChatHeader name="Local Chat Room" userCount={userCount} />
            <div className="flex-grow flex flex-col overflow-hidden">
                {isLoadingMessages ? (
                    <div className="flex-grow flex items-center justify-center text-muted-foreground">
                        Loading messages...
                    </div>
                ) : (
                    <ChatMessageList messages={messages} />
                )}
                <ChatInput
                    onSendMessageAction={handleSendMessage}
                    isLoading={isSendingMessage}
                />
            </div>
        </div>
    );
}