"use strict";

var turf = require('@turf/turf');

var User = require('../models/userModel');

var factory = require('./handlerFactory');

var catchAsync = require('../utils/catchAsync');

var AppError = require('../utils/appError');

exports.getUser = factory.getOne(User);
exports.getAllUser = factory.getAll(User);

var filterObj = function filterObj(obj) {
  for (var _len = arguments.length, allowedFields = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    allowedFields[_key - 1] = arguments[_key];
  }

  var newObj = {};
  Object.keys(obj).forEach(function (el) {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = function (req, res, next) {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(function _callee(req, res, next) {
  var filteredBody, updatedUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(req.body.password || req.body.passwordConfirm)) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400)));

        case 2:
          // 2) Filtered out unwanted fields names that are not allowed to be updated
          filteredBody = filterObj(req.body, 'name', 'email');
          if (req.file) filteredBody.photo = req.file.filename;
          req.body.currentLocation = turf.point(req.body.currentLocation).geometry; // 3) Update user document

          _context.next = 7;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, filteredBody, {
            "new": true,
            runValidators: true
          }));

        case 7:
          updatedUser = _context.sent;
          res.status(200).json({
            status: 'success',
            data: {
              user: updatedUser
            }
          });

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.deleteMe = catchAsync(function _callee2(req, res, next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            active: false
          }));

        case 2:
          res.status(204).json({
            status: 'success',
            data: null
          });

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
});

exports.createUser = function (req, res) {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.updateUser = catchAsync(function _callee3(req, res, next) {
  var doc;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (req.body.currentLocation) {
            req.body.currentLocation = turf.point(req.body.currentLocation).geometry;
          }

          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.params.id, req.body, {
            "new": true,
            runValidators: true
          }));

        case 3:
          doc = _context3.sent;

          if (doc) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", next(new AppError('No document found with that ID', 404)));

        case 6:
          res.status(200).json({
            status: 'success',
            data: {
              data: doc
            }
          });

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.deleteUser = factory.deleteOne(User);
exports.addDefaultHelpingLocation = catchAsync(function _callee4(req, res, next) {
  var user, updatedUser;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (req.body.addDefaultHelpingLocation) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt("return", next(new AppError('Please Provide your location Or enable your GPS', 400)));

        case 2:
          req.body.addDefaultHelpingLocation = turf.point(req.body.addDefaultHelpingLocation).geometry;
          _context4.next = 5;
          return regeneratorRuntime.awrap(User.findById(req.user._id));

        case 5:
          user = _context4.sent;
          user.defaultHelpingLocations.push(req.body.addDefaultHelpingLocation);
          _context4.next = 9;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(user._id, user, {
            "new": true,
            runValidators: true
          }));

        case 9:
          updatedUser = _context4.sent;
          res.status(200).json({
            status: 'success',
            data: {
              user: updatedUser
            }
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.updateMe = catchAsync(function _callee5(req, res, next) {
  var updatedUser;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!(req.body.email || req.body.password)) {
            _context5.next = 2;
            break;
          }

          return _context5.abrupt("return", next(new AppError('Please use forgot password for that,400')));

        case 2:
          if (req.body.currentLocation) {
            req.body.currentLocation = turf.point(req.body.currentLocation).geometry;
          }

          _context5.next = 5;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, req.body, {
            "new": true,
            runValidators: true
          }));

        case 5:
          updatedUser = _context5.sent;
          res.status(200).json({
            status: 'success',
            data: {
              user: updatedUser
            }
          });

        case 7:
        case "end":
          return _context5.stop();
      }
    }
  });
});