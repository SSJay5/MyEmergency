"use strict";

var crypto = require('crypto');

var _require = require('util'),
    promisify = _require.promisify;

var jwt = require('jsonwebtoken');

var User = require('../models/userModel');

var catchAsync = require('../utils/catchAsync');

var AppError = require('../utils/appError');

var signToken = function signToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

var createSendToken = function createSendToken(user, statusCode, res) {
  var token = signToken(user._id);
  var cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions); // Remove password from output

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: {
      user: user
    }
  });
};

exports.signup = catchAsync(function _callee(req, res, next) {
  var newUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
          }));

        case 2:
          newUser = _context.sent;
          //   const url = `${req.protocol}://${req.get('host')}/me`;
          //   console.log(url);
          //   await new Email(newUser, url).sendWelcome();
          createSendToken(newUser, 201, res);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.login = catchAsync(function _callee2(req, res, next) {
  var _req$body, email, password, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          console.log(email, password); // 1) Check if email and password exist

          if (!(!email || !password)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", next(new AppError('Please provide email and password!', 400)));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }).select('+password'));

        case 6:
          user = _context2.sent;
          _context2.t0 = !user;

          if (_context2.t0) {
            _context2.next = 12;
            break;
          }

          _context2.next = 11;
          return regeneratorRuntime.awrap(user.correctPassword(password, user.password));

        case 11:
          _context2.t0 = !_context2.sent;

        case 12:
          if (!_context2.t0) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", next(new AppError('Incorrect email or password', 401)));

        case 14:
          // 3) If everything ok, send token to client
          createSendToken(user, 200, res);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
});

exports.logout = function (req, res) {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: 'success'
  });
};

exports.protect = catchAsync(function _callee3(req, res, next) {
  var token, decoded, currentUser;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // 1) Getting token and check of it's there
          token = req.cookies.jwt;

          if (token) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", next(new AppError('You are not logged in! Please log in to get access.', 401)));

        case 3:
          _context3.next = 5;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(token, process.env.JWT_SECRET));

        case 5:
          decoded = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 8:
          currentUser = _context3.sent;

          if (currentUser) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", next(new AppError('The user belonging to this token does no longer exist.', 401)));

        case 11:
          if (!currentUser.changedPasswordAfter(decoded.iat)) {
            _context3.next = 13;
            break;
          }

          return _context3.abrupt("return", next(new AppError('User recently changed password! Please log in again.', 401)));

        case 13:
          // GRANT ACCESS TO PROTECTED ROUTE
          req.user = currentUser;
          res.locals.user = currentUser;
          next();

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // Only for rendered pages, no errors!

exports.isLoggedIn = function _callee4(req, res, next) {
  var decoded, currentUser;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!req.cookies.jwt) {
            _context4.next = 19;
            break;
          }

          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET));

        case 4:
          decoded = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(User.findById(decoded.id));

        case 7:
          currentUser = _context4.sent;

          if (currentUser) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", next());

        case 10:
          if (!currentUser.changedPasswordAfter(decoded.iat)) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", next());

        case 12:
          // THERE IS A LOGGED IN USER
          res.locals.user = currentUser;
          return _context4.abrupt("return", next());

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](1);
          return _context4.abrupt("return", next());

        case 19:
          next();

        case 20:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 16]]);
};

exports.restrictTo = function () {
  for (var _len = arguments.length, roles = new Array(_len), _key = 0; _key < _len; _key++) {
    roles[_key] = arguments[_key];
  }

  return function (req, res, next) {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
}; // exports.forgotPassword = catchAsync(async (req, res, next) => {
//   // 1) Get user based on POSTed email
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return next(new AppError('There is no user with email address.', 404));
//   }
//   // 2) Generate the random reset token
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });
//   // 3) Send it to user's email
//   try {
//     const resetURL = `${req.protocol}://${req.get(
//       'host'
//     )}/api/v1/users/resetPassword/${resetToken}`;
//     await new Email(user, resetURL).sendPasswordReset();
//     res.status(200).json({
//       status: 'success',
//       message: 'Token sent to email!',
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });
//     return next(
//       new AppError('There was an error sending the email. Try again later!'),
//       500
//     );
//   }
// });
// exports.resetPassword = catchAsync(async (req, res, next) => {
//   // 1) Get user based on the token
//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(req.params.token)
//     .digest('hex');
//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });
//   // 2) If token has not expired, and there is user, set the new password
//   if (!user) {
//     return next(new AppError('Token is invalid or has expired', 400));
//   }
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();
//   // 3) Update changedPasswordAt property for the user
//   // 4) Log the user in, send JWT
//   createSendToken(user, 200, res);
// });
// exports.updatePassword = catchAsync(async (req, res, next) => {
//   // 1) Get user from collection
//   const user = await User.findById(req.user.id).select('+password');
//   // 2) Check if POSTed current password is correct
//   if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
//     return next(new AppError('Your current password is wrong.', 401));
//   }
//   // 3) If so, update password
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   await user.save();
//   // User.findByIdAndUpdate will NOT work as intended!
//   // 4) Log user in, send JWT
//   createSendToken(user, 200, res);
// });