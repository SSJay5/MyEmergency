const turf = require('@turf/turf');
const Emergency = require('../models/emergencyModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

exports.createEmergency = catchAsync(async (req, res, next) => {
  let user = await User.findById(req.user._id);

  if (user.emergencyActive) {
    return next(
      new AppError(
        'Your Emergency Aleart is Active To view Go to Emergencies section or To create new One, First delete Previous One',
        400
      )
    );
  }
  if (!req.body.location) {
    return next(
      new AppError(
        'Please Provide Your Location. Make Sure Your GPS is ON !!!',
        400
      )
    );
  }
  //   const location = [];
  //   console.log(location);
  req.body.location = turf.point(req.body.location).geometry;
  req.body.active = true;
  req.body.user = req.user_id;
  const emergency = await Emergency.create(req.body);
  user.emergency = emergency._id;
  user.emergencyActive = true;
  user = await User.findByIdAndUpdate(user._id, user, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: emergency,
    },
  });
});

exports.deleteMyEmergency = catchAsync(async (req, res, next) => {
  const emergency = await Emergency.findById(req.user.emergency);

  if (!emergency) {
    return next(new AppError('Emergency Aleart is already deleted', 404));
  }
  await Emergency.findByIdAndDelete(req.params.id);

  const user = await User.findById(req.user._id);
  user.emergencyActive = false;
  user.emergency = undefined;

  await User.findByIdAndUpdate(user._id, user, {
    new: true,
    runValidators: true,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// emergencies/within/:distance/center/:latlng/unit/:unit
exports.getEmergencies = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user.currentLocation.length === 0) {
    return next(
      new AppError(
        'Please Set Your current Loaction or switch On GPS before helping',
        400
      )
    );
  }
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }
  const emergencies = await Emergency.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: emergencies.length,
    data: {
      data: emergencies,
    },
  });
});
