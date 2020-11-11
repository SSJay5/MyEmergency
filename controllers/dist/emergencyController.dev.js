"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var turf = require('@turf/turf');

var Emergency = require('../models/emergencyModel');

var AppError = require('../utils/appError');

var catchAsync = require('../utils/catchAsync');

var User = require('../models/userModel');

exports.createEmergency = catchAsync(function _callee(req, res, next) {
  var user, emergency;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user._id));

        case 2:
          user = _context.sent;

          if (!user.emergencyActive) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", next(new AppError('Your Emergency Aleart is Active To view Go to Emergencies section or To create new One First delete Previous One', 400)));

        case 5:
          if (!(user.currentLocation.coordinates.length === 0)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", next(new AppError('Please Provide Your Location. Make Sure Your GPS is ON !!!', 400)));

        case 7:
          //   const location = [];
          // console.log(user.currentLocation);
          req.body.location = user.currentLocation;
          req.body.active = true;
          req.body.user = user._id;
          req.body.createdAt = Date.now();
          _context.next = 13;
          return regeneratorRuntime.awrap(Emergency.create(req.body));

        case 13:
          emergency = _context.sent;
          user.emergency = emergency._id;
          user.emergencyActive = true;
          _context.next = 18;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(user._id, user, {
            "new": true,
            runValidators: true
          }));

        case 18:
          user = _context.sent;
          res.status(200).json({
            status: 'success',
            data: {
              data: emergency
            }
          });

        case 20:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.deleteMyEmergency = catchAsync(function _callee2(req, res, next) {
  var emergency, user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Emergency.findById(req.user.emergency));

        case 2:
          emergency = _context2.sent;

          if (emergency) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new AppError('Emergency Aleart is already deleted', 404)));

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(Emergency.findByIdAndDelete(emergency._id));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(User.findById(req.user._id));

        case 9:
          user = _context2.sent;
          user.emergencyActive = false;
          user.emergency = undefined;
          _context2.next = 14;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(user._id, user, {
            "new": true,
            runValidators: true
          }));

        case 14:
          res.status(204).json({
            status: 'success',
            data: null
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // emergencies/within/:distance/center/:latlng/unit/:unit

exports.getEmergencies = catchAsync(function _callee3(req, res, next) {
  var user, _req$params, distance, latlng, unit, _latlng$split, _latlng$split2, lat, lng, radius, emergencies;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!req.user) {
            res.redirect('/login');
          }

          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.user._id));

        case 3:
          user = _context3.sent;

          if (!(user.currentLocation.length === 0)) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", next(new AppError('Please Set Your current Loaction or switch On GPS before helping', 400)));

        case 6:
          _req$params = req.params, distance = _req$params.distance, latlng = _req$params.latlng, unit = _req$params.unit;
          _latlng$split = latlng.split(','), _latlng$split2 = _slicedToArray(_latlng$split, 2), lat = _latlng$split2[0], lng = _latlng$split2[1];
          radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

          if (!lat || !lng) {
            next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
          }

          _context3.next = 12;
          return regeneratorRuntime.awrap(Emergency.find({
            location: {
              $geoWithin: {
                $centerSphere: [[lng, lat], radius]
              }
            }
          }));

        case 12:
          emergencies = _context3.sent;
          res.status(200).json({
            status: 'success',
            results: emergencies.length,
            data: {
              data: emergencies
            }
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.getEmergencyLocation = catchAsync(function _callee4(req, res, next) {
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

          return _context4.abrupt("return", next(new AppError('Emergency ALerat is Deleted by user', 404)));

        case 5:
          res.status(200).json({
            status: 'success',
            data: {
              location: emergency.location.coordinates
            }
          });

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.updateMyEmergencyLocation = catchAsync(function _callee5(req, res, next) {
  var emergency;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Emergency.findById(req.user.emergency));

        case 2:
          emergency = _context5.sent;

          if (emergency) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", next(new AppError('Emergency ALerat is Deleted by user', 404)));

        case 5:
          emergency.location = turf.point(req.body.location).geometry;
          _context5.next = 8;
          return regeneratorRuntime.awrap(Emergency.findByIdAndUpdate(emergency._id, emergency, {
            "new": true,
            runValidators: true
          }));

        case 8:
          emergency = _context5.sent;
          res.status(200).json({
            status: 'success',
            data: {
              emergency: emergency
            }
          });

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  });
});