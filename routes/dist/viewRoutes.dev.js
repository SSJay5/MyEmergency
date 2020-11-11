"use strict";

var express = require('express');

var viewController = require('../controllers/viewController');

var authController = require('../controllers/authController');

var router = express.Router();
router.get('/login', viewController.getLoginForm); // router.use(authController.protect);

router.use(authController.isLoggedIn);
router.get('/', viewController.getHomePage);
router.get('/AllEmergencies', viewController.getAllEmergencies);
router.get('/emergencies/:distance/:latlng/:unit', viewController.getEmergencies);
router.get('/emergency/:id', viewController.getEmergency);
router.get('/account', viewController.getMyAccountDetails);
module.exports = router;