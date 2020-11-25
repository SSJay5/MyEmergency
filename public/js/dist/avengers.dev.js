"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.avenger = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*eslint-disable*/
var avenger = function avenger(type, index) {
  var data,
      res,
      user,
      _args = arguments;
  return regeneratorRuntime.async(function avenger$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          data = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};

          if (!(type === 'add')) {
            _context.next = 14;
            break;
          }

          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'POST',
            url: '/api/v1/avengers',
            data: data
          }));

        case 5:
          res = _context.sent;
          // console.log(res);
          window.setTimeout(function () {
            location.assign('/');
          }, 0);
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](2);
          return _context.abrupt("return", alert(_context.t0.response.data.message));

        case 12:
          _context.next = 26;
          break;

        case 14:
          _context.prev = 14;
          _context.next = 17;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'GET',
            url: '/api/v1/users/me'
          }));

        case 17:
          user = _context.sent;
          _context.next = 20;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'DELETE',
            url: "/api/v1/avengers/".concat(user.data.data.user.avengers[index]._id)
          }));

        case 20:
          window.setTimeout(function () {
            location.assign('/');
          }, 0);
          _context.next = 26;
          break;

        case 23:
          _context.prev = 23;
          _context.t1 = _context["catch"](14);
          return _context.abrupt("return", alert(_context.t1.response.data.message));

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 9], [14, 23]]);
};

exports.avenger = avenger;