const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Emergency = require('../models/emergencyModel');
const User = require('../models/userModel');

exports.getHomePage = (req, res) => {
  res.status(200).render('home', {
    title: 'Home',
  });
};

exports.getAllEmergencies = catchAsync(async (req, res, next) => {
  const emergencies = await Emergency.find();
  res.status(200).render('emergencies', {
    title: 'All Emergencies',
    emergencies,
  });
});

exports.getMyAccountDetails = (req, res) => {
  res.status(200).render('account', {
    title: 'Account',
  });
};

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login',
  });
});

exports.getEmergency = catchAsync(async (req, res, next) => {
  const emergency = await Emergency.findById(req.params.id);

  if (!emergency) {
    return next(new AppError('User Has deleted this emergency Aleart!!!', 404));
  }
  res.status(200).render('emergency', {
    title: 'Emergency',
    emergency,
  });
});
// emergencies/within/:distance/center/:latlng/unit/:unit
exports.getEmergencies = catchAsync(async (req, res, next) => {
  if (!req.user) {
    res.redirect('/login');
  }
  const user = await User.findById(req.user._id);
  console.log(user);
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
  res.status(200).render('emergencywithin', {
    title: 'Emergencies',
    emergencies,
    user,
  });
});
