const gameRooms = new Map();

module.exports = (socketIo) => {
  socketIo.on('connection', function (socket) {
    console.log('New connected ', socket.id);

    socket.on('disconnect', function () {
      const parner = gameRooms.get(socket.id);
      if (parner != undefined) {
        socketIo.to(parner).emit('disconnected');
      }
    });
    
    socket.on('message_chat', function (msg) {
      console.log('Received message ', socket.id, ' saying ', msg);
      const parner = gameRooms.get(socket.id);
      if (parner != undefined) {
        socketIo.to(parner).emit('message_chat', msg);
      }
    });

    socket.on('message_typing', function () {
      console.log('message_typing');
      const parner = gameRooms.get(socket.id);
      if (parner != undefined) {
        socketIo.to(parner).emit('message_typing');
      }
    });
  });
};