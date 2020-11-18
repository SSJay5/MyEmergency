"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var mongoose = require('mongoose');

var dotenv = require('dotenv');

var http = require('http');

var app = require('./app');

var Emergency = require('./models/emergencyModel');

var catchAsync = require('./utils/catchAsync');

var AppError = require('./utils/appError');

var getALLEmergencies = catchAsync(function _callee(rooms) {
  var emergencies;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Emergency.find());

        case 2:
          emergencies = _context.sent;
          emergencies.forEach(function (e) {
            rooms[e._id] = {
              users: {}
            };
          });
          console.log(rooms);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});
var addChat = catchAsync(function _callee2(room, name, message) {
  var emergency;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Emergency.findById(room));

        case 2:
          emergency = _context2.sent;

          if (emergency) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", new AppError('Emergency Not found', 400));

        case 5:
          emergency.chats.push("".concat(name, ": ").concat(message));
          console.log(emergency);
          _context2.next = 9;
          return regeneratorRuntime.awrap(Emergency.findByIdAndUpdate(room, emergency, {
            "new": true,
            runValidators: true
          }));

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
});
process.on('uncaughtException', function (err) {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({
  path: './config.env'
});
var DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(function () {
  return console.log('DB connection successful!!!');
});
var server = http.createServer(app);

var io = require('socket.io')(server);

var rooms = {};
getALLEmergencies(rooms);

function getUserRooms(socket) {
  return Object.entries(rooms).reduce(function (names, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        room = _ref2[1];

    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}

io.on('connection', function (socket) {
  socket.on('new-user', function (room, name) {
    socket.join(room);

    if (rooms[room] == null) {
      rooms[room] = {
        users: {}
      };
    }

    rooms[room].users[socket.id] = name;
    socket.to(room).broadcast.emit('user-connected', name);
  });
  socket.on('send-chat-message', function (room, message) {
    addChat(room, rooms[room].users[socket.id], message);
    socket.to(room).broadcast.emit('chat-message', {
      message: message,
      name: rooms[room].users[socket.id]
    });
  });
  socket.on('disconnect', function () {
    getUserRooms(socket).forEach(function (room) {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id];
    });
  });
});
server.listen(app.get('port'), function () {
  console.log("App Running on port ".concat(app.get('port'), "!!!"));
});
process.on('unhandledRejection', function (err) {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(function () {
    process.exit(1);
  });
});