import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

interface AuthenticationPayload {
    userId: string;
    userName: string;
}

interface MessagePayload {
    content: string;
}

interface AuthenticatedUser {
    socketId: string;
    userId: string;
    userName: string;
}

const authenticatedUsers = new Map<string, AuthenticatedUser>();

export const initSocketIOServer = (httpServerInstance: HttpServer) => {
    const io = new SocketIOServer(httpServerInstance, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        path: '/ws/socket.io',
    });

    console.log('[Socket.IO] Server initialized on path /ws/socket.io');

    io.on('connection', (socket: Socket) => {
        console.log(`[Socket.IO] Client connected: ${socket.id}`);

        socket.on('authenticate', (payload: AuthenticationPayload) => {
            if (!payload?.userId || !payload?.userName) {
                socket.emit('error', { message: 'Authentication failed: Missing user data' });
                return;
            }

            const userData: AuthenticatedUser = {
                socketId: socket.id,
                userId: payload.userId,
                userName: payload.userName,
            };

            authenticatedUsers.set(socket.id, userData);
            socket.emit('auth_success', { message: 'Authentication successful', userId: payload.userId });
            io.emit('user_count_update', { count: authenticatedUsers.size });
            console.log(`[Socket.IO] User authenticated: ${payload.userName} (${payload.userId})`);
        });

        socket.on('send_message', async (payload: MessagePayload) => {
            const user = authenticatedUsers.get(socket.id);
            if (!user) {
                socket.emit('error', { message: 'Not authenticated' });
                return;
            }

            if (!payload?.content?.trim()) {
                socket.emit('error', { message: 'Message cannot be empty' });
                return;
            }

            try {
                const apiUrl = 'http://localhost:3000/api/messages';
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        senderId: user.userId,
                        content: payload.content,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const result = await response.json();

                io.emit('new_message', {
                    id: result.data.id,
                    content: result.data.content,
                    sender_id: result.data.senderId,
                    sender_name: result.data.userName,
                    sent_at: result.data.sentAt,
                });

                console.log(`[Socket.IO] Message from ${user.userName}: ${payload.content.substring(0, 30)}${payload.content.length > 30 ? '...' : ''}`);
            } catch (error) {
                console.log('[Socket.IO] Error saving message', error);
                socket.emit('error', { message: 'Failed to save message' });
            }
        });

        socket.on('disconnect', () => {
            const user = authenticatedUsers.get(socket.id);
            if (!user) {
                console.log(`[Socket.IO] Unauthenticated client disconnected: ${socket.id}`);
                return;
            }

            console.log(`[Socket.IO] User disconnected: ${user.userName} (${socket.id})`);
            authenticatedUsers.delete(socket.id);
            io.emit('user_count_update', { count: authenticatedUsers.size });
        });

        socket.on('error', (error) => {
            console.log(`[Socket.IO] Socket error for ${socket.id}:`, error);
        });
    });

    return io;
};