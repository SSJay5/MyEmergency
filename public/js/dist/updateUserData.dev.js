"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUserData = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*eslint-disable*/
var updateUserData = function updateUserData(data) {
  var res;
  return regeneratorRuntime.async(function updateUserData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'PATCH',
            url: '/api/v1/users/updateMe',
            data: data
          }));

        case 3:
          res = _context.sent;

          if (res.data.status === 'success') {
            alert('Data updated Successfully');
            window.setTimeout(function () {
              location.assign('/account');
            }, 1500);
          }

          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", alert(_context.t0.response.data.message));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.updateUserData = updateUserData;