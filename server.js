const express = require('express');
const socket = require('socket.io');

const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

let tasks = [];

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  socket.on('addTask', task => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', id => {
    tasks.filter((task) => {
      task.id !== id;
    });
    socket.broadcast.emit('removeTask', id);
  });
});