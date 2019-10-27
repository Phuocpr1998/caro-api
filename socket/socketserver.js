var express = require('express');
var socketApp = express();
var http = require('http').createServer(socketApp);
var io = require('socket.io')(http);
io.on('connection', function (socket) {
    console.log('a user connected');
});
http.listen(9000, function(){
  console.log('listening socket on *:9000');
});

module.exports = io;