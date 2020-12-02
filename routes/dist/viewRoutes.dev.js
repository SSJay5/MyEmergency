"use strict";

var express = require('express');

var viewController = require('../controllers/viewController');

var authController = require('../controllers/authController');

var router = express.Router();
router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm); // router.use(authController.protect);

router.use(authController.isLoggedIn);
router.get('/users/resetPassword/:token', viewController.getResetPasswordForm);
router.get('/', viewController.getHomePage);
router.get('/AllEmergencies', viewController.getAllEmergencies);
router.get('/emergencies/:distance/:latlng/:unit', viewController.getEmergencies);
router.get('/emergency/:id', viewController.getEmergency);
router.get('/account', viewController.getMyAccountDetails);
router.get('/forgotPassword', viewController.getForgotPasswordForm);
module.exports = router;