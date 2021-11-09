const app = require('../app.js');
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(5000);

io.on('connection', function(socket){
  console.log('Websocket connection from client !');
});

module.exports = io;
