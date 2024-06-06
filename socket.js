// socket.js

const socketio = require('socket.io');

const users = {};

module.exports = (server) => {
  const io = socketio(server);

  io.on('connection', (socket) => {
    socket.on('join', (data) => {
      users[socket.id] = data.userId;
      socket.join(data.userId);
    });

    socket.on('message', (data) => {
      io.to(data.to).emit('message', { from: users[socket.id], message: data.message });
    });

    socket.on('disconnect', () => {
      delete users[socket.id];
    });
  });
};
