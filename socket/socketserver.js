module.exports = (socketIo) => {
  socketIo.on('connection', function (socket) {
    console.log('a user connected');
  });
};