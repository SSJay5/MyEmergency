const turf = require('@turf/turf');
const sharp = require('sharp');
const multer = require('multer');
const User = require('../models/userModel');
const Emergency = require('../models/emergencyModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getUser = factory.getOne(User);
exports.getAllUser = factory.getAll(User);

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`${__dirname}/../public/img/user/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = catchAsync(async (req, res, next) => {
  // console.log(req.user);
  req.params.id = req.user._id;
  const user = await User.findById(req.user._id).populate('avengers');
  if (!user) {
    return next(new AppError('No User found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (!req.user) {
    res.redirect('/login');
  }
  // console.log('updtae me called');
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  if (req.body.currentLocation)
    if (req.user.emergencyActive) {
      let emergency = await Emergency.findById(req.user.emergency);

      if (!emergency) {
        return next(new AppError('Emergency Alert is Deleted by user', 404));
      }

      emergency.location = turf.point(req.body.location).geometry;

      emergency = await Emergency.findByIdAndUpdate(emergency._id, emergency, {
        new: true,
        runValidators: true,
      });
      // console.log(emergency);
    }
  filteredBody.currentLocation = turf.point(req.body.currentLocation).geometry;
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // console.log(updatedUser);
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.currentLocation) {
    req.body.currentLocation = turf.point(req.body.currentLocation).geometry;
  }
  const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
exports.deleteUser = factory.deleteOne(User);

exports.addDefaultHelpingLocation = catchAsync(async (req, res, next) => {
  if (!req.body.addDefaultHelpingLocation) {
    return next(
      new AppError('Please Provide your location Or enable your GPS', 400)
    );
  }
  req.body.addDefaultHelpingLocation = turf.point(
    req.body.addDefaultHelpingLocation
  ).geometry;

  const user = await User.findById(req.user._id);
  user.defaultHelpingLocations.push(req.body.addDefaultHelpingLocation);
  const updatedUser = await User.findByIdAndUpdate(user._id, user, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// exports.updateMe = catchAsync(async (req, res, next) => {
//   if (req.body.email || req.body.password) {
//     return next(new AppError('Please use forgot password for that,400'));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: updatedUser,
//     },
//   });
// });
