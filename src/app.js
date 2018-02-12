const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

let score = 0;

const handler = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }

    res.writeHead(200);
    res.end(data);
  });
};

const app = http.createServer(handler);

app.listen(port);

const io = socketio(app);

io.on('connection', (socket) => {
  socket.join('room1');

  socket.on('updatePoints', (data) => {
    score += data;
    io.sockets.in('room1').emit('updated', score);
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});
