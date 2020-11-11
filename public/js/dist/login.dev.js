"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*eslint-disable*/
var login = function login(email, password) {
  var res;
  return regeneratorRuntime.async(function login$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
              email: email,
              password: password
            }
          }));

        case 3:
          res = _context.sent;

          if (res.data.status === 'success') {
            alert('Logged in Successfully');
            window.setTimeout(function () {
              location.assign('/');
            }, 1500);
          }

          console.log(res);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          alert(_context.t0.response.data.message);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.login = login;