"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var catchAsync = require('../utils/catchAsync');

var AppError = require('../utils/appError');

var Emergency = require('../models/emergencyModel');

var User = require('../models/userModel');

exports.getHomePage = catchAsync(function _callee(req, res) {
  var emergency;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!req.user) {
            _context.next = 4;
            break;
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(Emergency.findById(req.user.emergency));

        case 3:
          emergency = _context.sent;

        case 4:
          res.status(200).render('home', {
            title: 'Home',
            emergency: emergency
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getAllEmergencies = catchAsync(function _callee2(req, res, next) {
  var emergencies;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Emergency.find());

        case 2:
          emergencies = _context2.sent;
          res.status(200).render('emergencies', {
            title: 'All Emergencies',
            emergencies: emergencies
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});

exports.getMyAccountDetails = function (req, res) {
  res.status(200).render('account', {
    title: 'Account'
  });
};

exports.getLoginForm = catchAsync(function _callee3(req, res, next) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          res.status(200).render('login', {
            title: 'Login'
          });

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.getEmergency = catchAsync(function _callee4(req, res, next) {
  var emergency;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Emergency.findById(req.params.id));

        case 2:
          emergency = _context4.sent;

          if (emergency) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", next(new AppError('User Has deleted this emergency Alert!!!', 404)));

        case 5:
          res.status(200).render('emergency', {
            title: 'Emergency',
            emergency: emergency
          });

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // emergencies/within/:distance/center/:latlng/unit/:unit

exports.getEmergencies = catchAsync(function _callee5(req, res, next) {
  var user, _req$params, distance, latlng, unit, _latlng$split, _latlng$split2, lat, lng, radius, emergencies;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!req.user) {
            res.redirect('/login');
          }

          _context5.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.user._id));

        case 3:
          user = _context5.sent;

          if (!(user.currentLocation.length === 0)) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", next(new AppError('Please Set Your current Loaction or switch On GPS before helping', 400)));

        case 6:
          _req$params = req.params, distance = _req$params.distance, latlng = _req$params.latlng, unit = _req$params.unit;
          _latlng$split = latlng.split(','), _latlng$split2 = _slicedToArray(_latlng$split, 2), lat = _latlng$split2[0], lng = _latlng$split2[1];
          radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

          if (!lat || !lng) {
            next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
          }

          _context5.next = 12;
          return regeneratorRuntime.awrap(Emergency.find({
            location: {
              $geoWithin: {
                $centerSphere: [[lng, lat], radius]
              }
            }
          }));

        case 12:
          emergencies = _context5.sent;
          res.status(200).render('emergencywithin', {
            title: 'Emergencies',
            emergencies: emergencies,
            user: user
          });

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  });
});