console.log('Starting server...');

const express = require('express');
const app = express();

// Force HTTPS redirect for production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}

const io = require('socket.io')(process.env.PORT, {
    cors: {
        origin: [
            'http://localhost:3000', 
            'https://note-snap-psi.vercel.app',
            'https://note-snap-bmv2mrmep-damianrogers51s-projects.vercel.app'
        ],
        methods: ['GET', 'POST'],
        credentials: true
    },
    maxHttpBufferSize: 1e8,
    transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
    const noteId = socket.handshake.headers['note-id'];
    socket.join(noteId);
    console.log(`a user connected: ${socket.id}, for room: ${noteId}`);

    socket.on('image', (image) => {
        socket.to(noteId).emit('image', image);
        console.log('image emitted to room:', noteId);
    });
});
