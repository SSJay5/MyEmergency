"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signup = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*eslint-disable*/
var signup = function signup(name, email, password, passwordConfirm) {
  var res;
  return regeneratorRuntime.async(function signup$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'POST',
            url: '/api/v1/users/signUp',
            data: {
              name: name,
              email: email,
              password: password,
              passwordConfirm: passwordConfirm
            }
          }));

        case 3:
          res = _context.sent;

          if (res.data.status === 'success') {
            alert('Siggned in Successfully');
            window.setTimeout(function () {
              location.assign('/');
            }, 1500);
          }

          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          // console.error(err.response.data.message);
          // if (err.response.data.message.includes('duplicate key error collection')) {
          //   return alert('Someone already has that Username or Email');
          // }
          alert(_context.t0.response.data.message);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.signup = signup;