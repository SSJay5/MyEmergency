"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*eslint-disable*/
var logout = function logout() {
  var res;
  return regeneratorRuntime.async(function logout$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'POST',
            url: '/api/v1/users/logout'
          }));

        case 3:
          res = _context.sent;

          if (res.data.status === 'success') {
            alert('Logged Out Successfully');
            window.setTimeout(function () {
              location.assign('/');
            }, 1500);
          }

          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          alert(_context.t0.response.data.message);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.logout = logout;