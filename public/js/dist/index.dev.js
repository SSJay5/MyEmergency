"use strict";

require("@babel/polyfill");

var _mapbox = require("./mapbox");

var _login = require("./login");

var _logout = require("./logout");

var _signUp = require("./signUp");

var _axios = _interopRequireDefault(require("axios"));

var _help = require("./help");

var _avengers = require("./avengers");

var _resetPassword = require("./resetPassword");

var _forgotPassword = require("./forgotPassword");

var _updateUserData = require("./updateUserData");

var _updateUserPassword = require("./updateUserPassword");

var _sipnner = require("./sipnner");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable */
var socket = io('https://myemergency.herokuapp.com');
var messageForm = document.getElementById('send-container');
var messageContainer = document.getElementById('message-container');
var messageInput = document.getElementById('message-input');
var roomName;
var name;

function appendMessage(message) {
  var messageElement = document.createElement('div');
  messageElement.className = 'emergencyChatBox__message';
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

function isGoodNumber(n) {
  for (var i = 0; i < n.length; i += 1) {
    if (n[i] < '0' || n[i] > '9') {
      return false;
    }
  }

  return true;
}

if (messageForm != null) {
  name = JSON.parse(document.getElementById('message-container').dataset.username);
  roomName = JSON.parse(document.getElementById('map').getAttribute('data-emergencyid')); // console.log(name);

  appendMessage('You Joined');
  socket.emit('new-user', roomName, name);
  messageForm.addEventListener('submit', function (e) {
    e.preventDefault();
    roomName = JSON.parse(document.getElementById('map').getAttribute('data-emergencyid')); // console.log(roomName);

    if (messageInput.value.length === 0) {
      return;
    }

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

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value; // console.log(email, password);

    (0, _login.login)(email, password);
  });
}

var logoutButton = document.getElementsByClassName('logout');

if (logoutButton[0]) {
  logoutButton[0].addEventListener('click', function (e) {
    (0, _logout.logout)();
  });
}

if (logoutButton[1]) {
  logoutButton[1].addEventListener('click', function (e) {
    (0, _logout.logout)();
  });
}

var signUpForm = document.getElementById('signup');

if (signUpForm) {
  signUpForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var passwordConfirm = document.getElementById('passwordConfirm').value;

    if (password !== passwordConfirm) {
      return alert('Entered Passwords Do not match');
    }

    (0, _signUp.signup)(name, email, password, passwordConfirm);
  });
}

var EmergencySearch = document.querySelector('#search-emergencies');
var locations = [72.82119, 18.959125];

if (EmergencySearch) {
  EmergencySearch.addEventListener('click', function (e) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(function (data) {
      locations[0] = data.coords.longitude;
      locations[1] = data.coords.latitude; // displayMap(currLocation);
      // console.log(currLocation);
    }, function (error) {
      console.log(error);
      return alert('Please Turn On Your GPS !!!');
    }, {
      enableHighAccuracy: true
    });

    if (locations[0] == null || locations[1] == null) {
      return alert('Please Provide Your Location');
    }

    var distance = document.getElementById('helping_distance').value;

    if (!isGoodNumber(distance)) {
      return alert('Please Enter A Valid Number');
    }

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

var emergencyButton = document.getElementsByClassName('btn-emergency')[0];

if (emergencyButton) {
  emergencyButton.addEventListener('click', function _callee2(f) {
    var user, res, emergency, _Map;

    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            (0, _sipnner.spinner)('add');
            navigator.geolocation.getCurrentPosition(function (data) {
              locations[0] = data.coords.longitude;
              locations[1] = data.coords.latitude; // displayMap(currLocation);
              // console.log(currLocation);
            }, function (error) {
              // console.log(error);
              (0, _sipnner.spinner)('del');
              return alert('Please Turn On Your GPS !!!');
            }, {
              enableHighAccuracy: true
            });

            if (!(locations[0] == null || locations[1] == null)) {
              _context2.next = 5;
              break;
            }

            (0, _sipnner.spinner)('del');
            return _context2.abrupt("return", alert('Please Provide Your Location'));

          case 5:
            (0, _mapbox.displayMap)(locations);
            _context2.prev = 6;
            _context2.next = 9;
            return regeneratorRuntime.awrap((0, _axios["default"])({
              method: 'PATCH',
              url: '/api/v1/users/updateMe',
              data: {
                currentLocation: locations
              }
            }));

          case 9:
            res = _context2.sent;
            _context2.next = 12;
            return regeneratorRuntime.awrap((0, _axios["default"])({
              method: 'GET',
              url: '/api/v1/users/me'
            }));

          case 12:
            user = _context2.sent;

            if (!user.emergencyActive) {
              _context2.next = 18;
              break;
            }

            (0, _sipnner.spinner)('del');
            return _context2.abrupt("return", alert('Your Emergency Alert is already Active '));

          case 18:
            _context2.next = 20;
            return regeneratorRuntime.awrap((0, _axios["default"])({
              method: 'GET',
              url: '/api/v1/emergencies'
            }));

          case 20:
            emergency = _context2.sent;
            emergencyButton.style.animationName = 'scaleDown';
            emergencyButton.style.animationDuration = '1s';
            _Map = document.getElementById('map');

            _Map.setAttribute('data-emergencyid', JSON.stringify(emergency.data.data.data._id)); // console.log(Map);


            emergencyButton.remove();

          case 26:
            name = JSON.parse(document.getElementById('message-container').dataset.username);
            roomName = JSON.parse(document.getElementById('map').getAttribute('data-emergencyid'));
            (0, _sipnner.spinner)('del');
            socket.emit('new-user', roomName, name);
            document.getElementById('blurLayer').remove();
            _context2.next = 37;
            break;

          case 33:
            _context2.prev = 33;
            _context2.t0 = _context2["catch"](6);
            (0, _sipnner.spinner)('del');
            return _context2.abrupt("return", alert(_context2.t0.response.data.message));

          case 37:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[6, 33]]);
  });
}

if (document.getElementById('map')) (0, _mapbox.displayMap)(locations);
var refreshButton = document.getElementsByClassName('btn-refresh')[0];

if (refreshButton) {
  refreshButton.addEventListener('click', function _callee3(f) {
    var res;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            navigator.geolocation.getCurrentPosition(function (data) {
              locations[0] = data.coords.longitude;
              locations[1] = data.coords.latitude; // displayMap(currLocation);
              // console.log(currLocation);
            }, function (error) {
              console.log(error);
              return alert('Please Turn On Your GPS !!!');
            }, {
              enableHighAccuracy: true
            });

            if (!(locations[0] == null || locations[1] == null)) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", alert('Please Provide Your Location'));

          case 3:
            (0, _mapbox.displayMap)(locations);
            _context3.prev = 4;
            _context3.next = 7;
            return regeneratorRuntime.awrap((0, _axios["default"])({
              method: 'PATCH',
              url: '/api/v1/users/updateMe',
              data: {
                currentLocation: locations
              }
            }));

          case 7:
            res = _context3.sent;
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](4);
            return _context3.abrupt("return", alert('Please Login To Continue'));

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[4, 10]]);
  });
}

var helpButton = document.getElementsByClassName('btn-help')[0];
var helpingLocation = [];

if (helpButton) {
  helpButton.addEventListener('click', function _callee4(e) {
    var emergencyId, res, _res;

    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            e.preventDefault();
            navigator.geolocation.getCurrentPosition(function (data) {
              locations[0] = data.coords.longitude;
              locations[1] = data.coords.latitude; // displayMap(currLocation);
              // console.log(currLocation);
            }, function (error) {
              console.log(error);
              return alert('Please Turn On Your GPS !!!');
            }, {
              enableHighAccuracy: true
            }); // console.log(getMyCurrnetLocation());

            if (!(locations[0] == null || locations[1] == null)) {
              _context4.next = 4;
              break;
            }

            return _context4.abrupt("return", alert('Please Provide Your Location'));

          case 4:
            emergencyId = JSON.parse(document.getElementById('map').dataset.emergencyid);
            _context4.prev = 5;
            _context4.next = 8;
            return regeneratorRuntime.awrap((0, _axios["default"])({
              method: 'GET',
              url: "/api/v1/emergencies/".concat(emergencyId)
            }));

          case 8:
            res = _context4.sent;
            helpingLocation = res.data.data.location; // console.log(res.data);

            _context4.next = 15;
            break;

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](5);
            return _context4.abrupt("return", alert(_context4.t0.response.data.message));

          case 15:
            _context4.prev = 15;
            _context4.next = 18;
            return regeneratorRuntime.awrap((0, _axios["default"])({
              method: 'PATCH',
              url: '/api/v1/users/updateMe',
              data: {
                currentLocation: locations
              }
            }));

          case 18:
            _res = _context4.sent;
            _context4.next = 24;
            break;

          case 21:
            _context4.prev = 21;
            _context4.t1 = _context4["catch"](15);
            return _context4.abrupt("return", alert(_context4.t1.response.data.message));

          case 24:
            // console.log(helpingLocation);
            // console.log(locations);
            (0, _help.help)(helpingLocation, locations);

          case 25:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[5, 12], [15, 21]]);
  });
}

var Avengers = document.getElementsByClassName('notifyAvengers__card');

var _loop = function _loop(i) {
  if (Avengers[i] != null && Avengers[i].children[2].textContent === 'DELETE') {
    Avengers[i].children[2].addEventListener('click', function (e) {
      e.preventDefault();
      (0, _avengers.avenger)('delete', i);
    });
  } else {
    Avengers[i].children[2].addEventListener('click', function (e) {
      e.preventDefault();
      var name = Avengers[i].children[0].value;
      var phoneNumber = Avengers[i].children[1].value;

      if (!isGoodNumber(phoneNumber) || phoneNumber.length != 10) {
        return alert('Please Enter a valid Indian Phone Number');
      }

      var data = {
        name: name,
        phoneNumber: phoneNumber
      };
      (0, _avengers.avenger)('add', i, data);
    });
  }
};

for (var i = 0; i < Avengers.length; i += 1) {
  _loop(i);
}

var resetPasswordForm = document.getElementById('reset-passwordForm');

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var password = document.getElementById('password').value;
    var passwordConfirm = document.getElementById('passwordConfirm').value;

    if (password != passwordConfirm) {
      return alert('Enterd Passwords Do not match');
    }

    var url = window.location.href;
    var token = url.split('/'); // console.log(password, passwordConfirm, token[token.length - 1]);

    (0, _resetPassword.resetPassword)(password, "".concat(token[token.length - 1]));
  });
}

var forgotPasswordForm = document.getElementById('forgotPassword-form');

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', function _callee5(e) {
    var email;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            e.preventDefault();
            email = document.getElementById('email').value;
            (0, _forgotPassword.forgotPassword)(email);

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
}

var Police = document.getElementById('Police');
if (Police) Police.addEventListener('click', function () {
  var number = document.getElementById('PoliceN');
  number.select();
  document.execCommand('copy');
});
var Ambulance = document.getElementById('Ambulance');
if (Ambulance) Ambulance.addEventListener('click', function () {
  var number = document.getElementById('AmbulanceN');
  number.select();
  document.execCommand('copy');
});
var Fire = document.getElementById('Fire');
if (Fire) Fire.addEventListener('click', function () {
  var number = document.getElementById('FireN');
  number.select();
  document.execCommand('copy');
});
var NDRF = document.getElementById('NDRF');
if (NDRF) NDRF.addEventListener('click', function () {
  var number = document.getElementById('NDRFN');
  number.select();
  document.execCommand('copy');
});
var Women = document.getElementById('Women');
if (Women) Women.addEventListener('click', function () {
  var number = document.getElementById('WomenN');
  number.select();
  document.execCommand('copy');
});
var Nemergency = document.getElementById('Nemergency');
if (Nemergency) Nemergency.addEventListener('click', function () {
  var number = document.getElementById('NemergencyN');
  number.select();
  document.execCommand('copy');
});
var updateUserDataForm = document.getElementById('updateUserDetails-form');

if (updateUserDataForm) {
  updateUserDataForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]); // console.log(form);

    (0, _updateUserData.updateUserData)(form);
  });
}

var updateUserPasswordForm = document.getElementById('updateUser-password');

if (updateUserPasswordForm) {
  updateUserPasswordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var passwordCurrent = document.getElementById('current_password').value;
    var password = document.getElementById('new_password').value;
    var passwordConfirm = document.getElementById('confirm_password').value;

    if (password != passwordConfirm) {
      return alert('Entered Passwords do not match');
    }

    (0, _updateUserPassword.updateUserPassword)(passwordCurrent, password);
  });
}

var scrollDown = document.getElementsByClassName('btn-scroll__helpline')[0];

if (scrollDown) {
  scrollDown.addEventListener('click', function () {
    window.scrollBy(0, 600);
  });
}