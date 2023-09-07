const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const users={};
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));
io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log('New user', name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);   // It will show every other user a message that a user joined
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });
    socket.on('disconnect', message => {
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });

});
const PORT = process.env.PORT || 8000;  // Use the provided port or default to 8000
server.listen(PORT, () => {
    console.log(`Your Node.js server is running on port ${PORT}`);
});