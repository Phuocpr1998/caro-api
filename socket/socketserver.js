const gameRooms = new Map();

module.exports = (socketIo) => {
  socketIo.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
      const parner = gameRooms.get(socket.id);
      if (parner != undefined) {
        socketIo.to(parner).emit('disconnected');
      }
      //debug
      socket.emit('disconnected')
    });
    
    socket.on('message_chat', function (from, msg) {
      console.log('Received message ', from, ' saying ', msg);
      const parner = gameRooms.get(socket.id);
      if (parner != undefined) {
        socketIo.to(parner).emit('message_chat', msg);
      }
      //debug
      socket.emit('message_chat', msg);
    });

    socket.on('message_typing', function (from, msg) {
      console.log('Received message ', from, ' saying ', msg);
      const parner = gameRooms.get(socket.id);
      if (parner != undefined) {
        socketIo.to(parner).emit('message_typing', msg);
      }
    });
  });
};