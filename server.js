const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const app = require('./app');
const Emergency = require('./models/emergencyModel');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');

const getALLEmergencies = catchAsync(async (rooms) => {
  const emergencies = await Emergency.find();

  emergencies.forEach((e) => {
    rooms[e._id] = { users: {} };
  });
  // console.log(rooms);
});

const addChat = catchAsync(async (room, name, message) => {
  const emergency = await Emergency.findById(room);
  // console.log(emergency);
  if (!emergency) {
    return new AppError('Emergency Not found', 400);
  }
  emergency.chats.push(`${name}: ${message}`);
  // console.log(emergency);
  await Emergency.findByIdAndUpdate(room, emergency, {
    new: true,
    runValidators: true,
  });
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!!!'));

const server = http.createServer(app);
const io = require('socket.io')(server);

const rooms = {};
getALLEmergencies(rooms);
function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}

io.on('connection', (socket) => {
  socket.on('new-user', (room, name) => {
    socket.join(room);
    if (rooms[room] == null) {
      rooms[room] = { users: {} };
    }
    rooms[room].users[socket.id] = name;
    socket.to(room).broadcast.emit('user-connected', name);
  });
  socket.on('send-chat-message', (room, message) => {
    console.log(rooms[room]);
    addChat(room, rooms[room].users[socket.id], message);
    socket.to(room).broadcast.emit('chat-message', {
      message: message,
      name: rooms[room].users[socket.id],
    });
  });
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach((room) => {
      socket
        .to(room)
        .broadcast.emit('user-disconnected', rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id];
    });
  });
});
server.listen(app.get('port'), () => {
  console.log(`App Running on port ${app.get('port')}!!!`);
});
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
