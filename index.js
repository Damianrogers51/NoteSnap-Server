console.log('Starting server...');

const io = require('socket.io')(process.env.PORT, {
    cors: {
        origin: '*',
    },
    maxHttpBufferSize: 1e8,
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
