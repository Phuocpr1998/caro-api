let gameRooms = new Map();
let players = [];
let loserPlayers = [];

function getRandomInt() {
  return Math.floor(Math.random() * 2) + 1;
}

module.exports = {
  setupSocket: (socketIo) => {
    socketIo.on('connection', function (socket) {
      console.log('New connected ', socket.id);

      socket.on('disconnect', function () {
        const partner = gameRooms.get(socket.id);
        if (partner != undefined) {
          socketIo.to(partner).emit('partner_disconnected');
          gameRooms.delete(socket.id);
          if (gameRooms.has(partner)) {
            gameRooms.delete(partner);
          }
        } else {
          let isExits = false;
          for (i = 0; i < players.length; i++) {
            if (players[i].socketId === socket.id) {
              isExits = true;
              break;
            }
          }
          if (isExits) {
            players = players.filter(player => {
              return player.socketId != socket.id;
            });
          }
        }
      });

      socket.on('find_room', function (user) {
        console.log('Received command find_room ', socket.id, ' user ', user);
        if (user === undefined || user === null) {
          socket.emit('join_room', { error: "User is not found" });
        } else {
          if (gameRooms.has(socket.id)) { // already in a rooom
            socket.emit('join_room', { error: "Already in a room" });
          } else {
            if (players.length != 0) {
              let isExits = false;
              for (i = 0; i < players.length; i++) {
                if (players[i].user.email === user.email) {
                  isExits = true;
                  break;
                }
              }
              if (isExits) { // already request find room
                return socket.emit('join_room', { error: "Already request find room" });
              }

              const player = players.pop();
              const xPlayer = getRandomInt();
              const oPlayer = xPlayer === 1 ? 2 : 1;
              socket.emit('join_room', { player: player.user, Xplayer: xPlayer });
              socketIo.to(player.socketId).emit('join_room', { player: user, Xplayer: oPlayer });
              gameRooms.set(socket.id, player.socketId)
              gameRooms.set(player.socketId, socket.id)
            } else {
              players.push({ user, socketId: socket.id })
            }
          }
        }
      });

      socket.on('find_room_failed', function () {
        console.log('Received command find_room_failed ', socket.id);
        let isExits = false;
        for (i = 0; i < players.length; i++) {
          if (players[i].socketId === socket.id) {
            isExits = true;
            break;
          }
        }
        if (isExits) {
          players = players.filter(player => {
            return player.socketId != socket.id;
          });
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

      socket.on('fight', function (msg) {
        console.log('Received fight ', socket.id, ' saying ', msg);
        const parner = gameRooms.get(socket.id);
        if (parner != undefined) {
          socketIo.to(parner).emit('fight', msg);
        }
      });

      socket.on('loser', function (msg) {
        console.log('Received loser ', socket.id, ' saying ', msg);
        const parner = gameRooms.get(socket.id);
        if (parner != undefined) {
          loserPlayers.push(socket.id);
          socketIo.to(parner).emit('winner', socket.id);
        }
      });

      socket.on('give_up', function (msg) {
        console.log('Received give_up ', socket.id, ' saying ', msg);
        const parner = gameRooms.get(socket.id);
        if (parner != undefined) {
          socketIo.to(parner).emit('give_up', msg);
        }
      });

      socket.on('give_up_accept', function (msg) {
        console.log('Received give_up_accept ', socket.id, ' saying ', msg);
        const parner = gameRooms.get(socket.id);
        if (parner != undefined) {
          socketIo.to(parner).emit('give_up_accept', msg);
        }
      });

      socket.on('give_up_cancel', function (msg) {
        console.log('Received give_up_cancel ', socket.id, ' saying ', msg);
        const parner = gameRooms.get(socket.id);
        if (parner != undefined) {
          socketIo.to(parner).emit('give_up_cancel', msg);
        }
      });
    });
  },
  checkWinner: (socketID) => {
    let isExits = false;
    for (i = 0; i < loserPlayers.length; i++) {
      if (loserPlayers[i] === socketID) {
        isExits = true;
        break;
      }
    }
    if (isExits) {
      loserPlayers = loserPlayers.filter(id => {
        return id != socketID;
      });
    }
    return isExits;
  }
};