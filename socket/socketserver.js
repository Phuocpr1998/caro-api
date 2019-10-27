const gameRooms = new Map();
const players = [];

module.exports = (socketIo) => {
  socketIo.on('connection', function (socket) {
    console.log('New connected ', socket.id);

    socket.on('disconnect', function () {
      const partner = gameRooms.get(socket.id);
      if (partner != undefined) {
        socketIo.to(partner).emit('disconnected');
        gameRooms.delete(socket.id);
        if (gameRooms.has(partner)) {
          gameRooms.delete(partner);
        }
      }
    }); 
    
    socket.on('find_room', function (user) {
      console.log('Received command find_room ', socket.id, ' user ', user);
      if (gameRooms.has(socket.id)) { // already in a rooom
        socket.emit('join_room', {error: "Already in a rooom"});
      } else {
        if (players.length != 0) {
          const player = players.pop();
          socket.emit('join_room', {player: player.user});
          socketIo.to(player.socketId).emit('join_room', {player: user});
          gameRooms.set(socket.id, player.socketId)
          gameRooms.set(player.socketId, socket.id)
        } else {
          players.push({user, socketId: socket.id})
        }
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