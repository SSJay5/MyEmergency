const Avenger = require('../models/avengerModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createAvenger = catchAsync(async (req, res, next) => {
  const user = req.user._id;
  let name = 'No Name';
  if (req.body.name) {
    name = req.body.name;
  }
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return new AppError('Please Provide the Phone number', 400);
  }
  const avenger = await Avenger.create({
    name,
    user,
    phoneNumber,
  });
  res.status(201).json({
    status: 'success',
    data: {
      avenger,
    },
  });
});

exports.deleteAvenger = catchAsync(async (req, res, next) => {
  await Avenger.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
