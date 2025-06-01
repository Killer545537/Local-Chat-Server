'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessageList } from '@/components/chat/chat-message-list';
import { ChatInput } from '@/components/chat/chat-input';
import { Message } from '@/types/chat';
import { io, Socket } from 'socket.io-client';

// Define types used in this component
interface CurrentUser {
    id: string;
    userName: string;
    email?: string;
}

export default function ChatPage() {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [userCount, setUserCount] = useState(0);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch current user from JWT cookie
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (!response.ok) {
                    throw new Error('Not authenticated');
                }

                const data = await response.json();
                setCurrentUser({
                    id: data.user.id,
                    userName: data.user.userName,
                    email: data.user.email,
                });
            } catch (error) {
                console.error('Error fetching current user:', error);
                window.location.href = '/login'; // Redirect to login
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchCurrentUserAndMessages = async () => {
            try {
                const userRes = await fetch('/api/auth/me');
                if (!userRes.ok) throw new Error('Not authenticated');
                const userData = await userRes.json();
                setCurrentUser({
                    id: userData.user.id,
                    userName: userData.user.userName,
                    email: userData.user.email,
                });

                const msgRes = await fetch('/api/messages');
                if (msgRes.ok) {
                    const msgData = await msgRes.json();
                    if (Array.isArray(msgData.messages)) {
                        const loadedMessages: Message[] = msgData.messages.map((m: {
                            id: string,
                            content: string,
                            senderId: string,
                            userName: string,
                            sentAt: Date
                        }) => ({
                            id: m.id,
                            text: m.content,
                            sender: m.userName,
                            senderId: m.senderId,
                            isOwnMessage: m.senderId === userData.user.id,
                            timestamp: new Date(m.sentAt),
                        }));
                        setMessages(loadedMessages);
                    } else {
                        setMessages([]); // or handle error
                    }
                }
            } catch (error) {
                console.error('Error fetching user or messages:', error);
                window.location.href = '/login';
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrentUserAndMessages();
    }, []);

    // Set up WebSocket connection once we have user data
    useEffect(() => {
        if (!currentUser) return;

        const socketInstance = io({
            path: '/ws/socket.io',
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            transports: ['websocket', 'polling'],
        });

        socketInstance.on('connect', () => {
            console.log('Connected to WebSocket server');

            // Authenticate with socket server
            socketInstance.emit('authenticate', {
                userId: currentUser.id,
                userName: currentUser.userName,
            });
        });

        socketInstance.on('auth_success', () => {
            console.log('Socket authentication successful');
        });

        socketInstance.on('user_count_update', (data) => {
            setUserCount(data.count);
        });

        socketInstance.on('new_message', (data) => {
            const newMessage: Message = {
                id: data.id,
                text: data.content,
                sender: data.sender_name,
                senderId: data.sender_id,
                isOwnMessage: data.sender_id === currentUser.id,
                timestamp: new Date(data.sent_at),
            };

            setMessages(prevMessages => [...prevMessages, newMessage]);
        });

        socketInstance.on('error', (error) => {
            console.error('Socket error:', error);
        });

        setSocket(socketInstance);

        // Clean up on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, [currentUser]);

    const handleSendMessage = useCallback((messageText: string) => {
        if (!currentUser || !socket) {
            console.error('Cannot send message: User not authenticated or socket not connected');
            return;
        }

        if (!messageText.trim()) return;

        setIsSendingMessage(true);

        // Send message through WebSocket
        socket.emit('send_message', { content: messageText });

        // We don't add the message locally - the server will broadcast it back
        setTimeout(() => {
            setIsSendingMessage(false);
        }, 300);
    }, [currentUser, socket]);

    if (isLoading) {
        return (
            <div className="flex flex-col h-screen bg-muted/50 items-center justify-center p-4 text-center">
                <p className="text-lg mb-4">Loading chat...</p>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="flex flex-col h-screen bg-muted/50 items-center justify-center p-4 text-center">
                <p className="text-lg text-destructive mb-4">Not authenticated</p>
                <p className="text-muted-foreground mb-6">Please log in to access the chat.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-muted/50">
            <ChatHeader
                name={`${currentUser.userName}'s Chat Room`}
                userCount={userCount}
            />

            <div className="flex-grow flex flex-col overflow-hidden">
                <ChatMessageList messages={messages} />
            </div>

            <ChatInput
                onSendMessageAction={handleSendMessage}
                isLoading={isSendingMessage}
            />
        </div>
    );
}