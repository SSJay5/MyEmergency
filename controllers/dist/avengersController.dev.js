"use strict";

var Avenger = require('../models/avengerModel');

var catchAsync = require('../utils/catchAsync');

var AppError = require('../utils/appError');

exports.createAvenger = catchAsync(function _callee(req, res, next) {
  var user, name, phoneNumber, avenger;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = req.user._id;
          name = 'No Name';

          if (req.body.name) {
            name = req.body.name;
          }

          phoneNumber = req.body.phoneNumber;

          if (phoneNumber) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", new AppError('Please Provide the Phone number', 400));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(Avenger.create({
            name: name,
            user: user,
            phoneNumber: phoneNumber
          }));

        case 8:
          avenger = _context.sent;
          res.status(201).json({
            status: 'success',
            data: {
              avenger: avenger
            }
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.deleteAvenger = catchAsync(function _callee2(req, res, next) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Avenger.findByIdAndDelete(req.params.id));

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