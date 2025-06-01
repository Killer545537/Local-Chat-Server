import next from 'next';
import http from 'http';
import { parse } from 'url';
import { initSocketIOServer } from './socketio';

// Initialize Next.js
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare()
    .then(() => {
        // Create HTTP server
        const server = http.createServer((req, res) => {
            const parsedUrl = parse(req.url || '', true);

            // Let Next.js handle all HTTP requests
            handle(req, res, parsedUrl);
        });

        // Initialize Socket.IO with our HTTP server
        const _io = initSocketIOServer(server);

        // Start the server
        server.listen(port, () => {
            console.log(`> Server listening on http://localhost:${port}`);
            console.log(`> WebSocket server available at ws://localhost:${port}/ws/socket.io`);
        });

        // Handle graceful shutdown
        const signals = ['SIGINT', 'SIGTERM'];
        signals.forEach(signal => {
            process.on(signal, () => {
                console.log(`> ${signal} received, closing server...`);
                server.close(() => {
                    console.log('> Server closed');
                    process.exit(0);
                });
            });
        });
    })
    .catch(err => {
        console.error('Error starting server:', err);
        process.exit(1);
    });