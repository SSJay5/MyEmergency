"use strict";

require("@babel/polyfill");

var _mapbox = require("./mapbox");

var _login = require("./login");

var _axios = _interopRequireDefault(require("axios"));

var _help = require("./help");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable */
var socket = io('https://myemergency.herokuapp.com');
var messageForm = document.getElementById('send-container');
var messageContainer = document.getElementById('message-container');
var messageInput = document.getElementById('message-input');

function appendMessage(message) {
  var messageElement = document.createElement('div');
  messageElement.className = 'emergencyChatBox__message';
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

if (messageForm != null) {
  var name = JSON.parse(document.getElementById('message-container').dataset.username);
  var roomName = JSON.parse(document.getElementById('map').dataset.emergencyid);
  appendMessage('You Joined');
  socket.emit('new-user', roomName, name);
  messageForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var message = messageInput.value;
    appendMessage("You: ".concat(message));
    socket.emit('send-chat-message', roomName, message);
    messageInput.value = '';
  });
}

socket.on('chat-message', function (data) {
  appendMessage("".concat(data.name, ": ").concat(data.message));
});
socket.on('user-connected', function (name) {
  appendMessage("".concat(name, " connected"));
});
socket.on('user-disconnected', function (name) {
  appendMessage("".concat(name, " disconnected"));
});
var form = document.querySelector('#form');
console.log(form);

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    console.log(email, password);
    (0, _login.login)(email, password);
  });
}

var EmergencySearch = document.querySelector('#search-emergencies');
var locations = [72.82119, 18.959125];

if (EmergencySearch) {
  EmergencySearch.addEventListener('click', function (e) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(function (data) {
      locations[0] = data.coords.longitude;
      locations[1] = data.coords.latitude;
      (0, _mapbox.displayMap)(locations);
      console.log(locations);
    }, function (error) {
      console.log(error);
    }, {
      enableHighAccuracy: true
    });
    var distance = document.getElementById('helping_distance').value;
    distance = distance * 1; // console.log('yeh ', distance);
    // emergencies/within/:distance/center/:latlng/unit/:unit

    window.setTimeout(function () {
      location.assign("/emergencies/".concat(distance, "/").concat(locations[1], ",").concat(locations[0], "/km"));
    }, 0);
  });
}

var deleteEmergencyButton = document.getElementsByClassName('emergencies__Card-cancel')[0];

if (deleteEmergencyButton) {
  deleteEmergencyButton.addEventListener('click', function _callee(f) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap((0, _axios["default"])({
              method: 'DELETE',
              url: '/api/v1/emergencies'
            }));

          case 3:
            window.setTimeout(function () {
              location.assign("/AllEmergencies");
            }, 0);
            _context.next = 9;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", alert(_context.t0.response.data.message));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 6]]);
  });
}

(0, _mapbox.displayMap)(locations);
var refreshButton = document.getElementsByClassName('btn-refresh')[0];

if (refreshButton) {
  refreshButton.addEventListener('click', function (f) {
    navigator.geolocation.getCurrentPosition(function (data) {
      locations[0] = data.coords.longitude;
      locations[1] = data.coords.latitude;
      (0, _mapbox.displayMap)(locations);
      console.log(locations);
    }, function (error) {
      console.log(error);
    }, {
      enableHighAccuracy: true
    });
  });
}

var emergencyButton = document.getElementsByClassName('btn-emergency')[0];

if (emergencyButton) {
  emergencyButton.addEventListener('click', function _callee2(f) {
    var user, emergency;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap((0, _axios["default"])({
              method: 'GET',
              url: '/api/v1/users/me'
            }));

          case 3:
            user = _context2.sent;
            _context2.next = 9;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", alert(_context2.t0.response.data.message));

          case 9:
            if (!user.emergencyActive) {
              _context2.next = 13;
              break;
            }

            return _context2.abrupt("return", alert('Your Emergency Alert is already Active '));

          case 13:
            _context2.prev = 13;
            _context2.next = 16;
            return regeneratorRuntime.awrap((0, _axios["default"])({
              method: 'GET',
              url: '/api/v1/emergencies'
            }));

          case 16:
            emergency = _context2.sent;
            emergencyButton.style.animationName = 'scaleDown';
            emergencyButton.style.animationDuration = '1s';
            emergencyButton.remove();
            _context2.next = 25;
            break;

          case 22:
            _context2.prev = 22;
            _context2.t1 = _context2["catch"](13);
            return _context2.abrupt("return", alert(_context2.t1.response.data.message));

          case 25:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 6], [13, 22]]);
  });
}

var helpButton = document.getElementsByClassName('btn-help')[0];
var helpingLocation = [];

if (helpButton) {
  helpButton.addEventListener('click', function _callee3(e) {
    var emergencyId, res, _res;

    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            e.preventDefault();
            navigator.geolocation.getCurrentPosition(function (data) {
              locations[0] = data.coords.longitude;
              locations[1] = data.coords.latitude;
            }, function (error) {
              return console.log(error);
            }, {
              enableHighAccuracy: true
            });
            emergencyId = JSON.parse(document.getElementById('map').dataset.emergencyid);
            _context3.prev = 3;
            _context3.next = 6;
            return regeneratorRuntime.awrap((0, _axios["default"])({
              method: 'GET',
              url: "/api/v1/emergencies/".concat(emergencyId)
            }));

          case 6:
            res = _context3.sent;
            helpingLocation = res.data.data.location;
            console.log(res.data);
            _context3.next = 14;
            break;

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](3);
            return _context3.abrupt("return", alert(_context3.t0.response.data.message));

          case 14:
            _context3.prev = 14;
            _context3.next = 17;
            return regeneratorRuntime.awrap((0, _axios["default"])({
              method: 'PATCH',
              url: '/api/v1/users/updateMe',
              data: {
                currentLocation: locations
              }
            }));

          case 17:
            _res = _context3.sent;
            _context3.next = 23;
            break;

          case 20:
            _context3.prev = 20;
            _context3.t1 = _context3["catch"](14);
            return _context3.abrupt("return", alert(_context3.t1.response.data.message));

          case 23:
            console.log(helpingLocation);
            console.log(locations);
            (0, _help.help)(helpingLocation, locations);

          case 26:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[3, 11], [14, 20]]);
  });
}