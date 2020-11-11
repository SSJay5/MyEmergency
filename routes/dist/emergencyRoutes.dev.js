"use strict";

var express = require('express');

var authController = require('../controllers/authController');

var emergencyController = require('../controllers/emergencyController');

var router = express.Router(); // Logged IN users only

router.use(authController.protect);
router.route('/').get(emergencyController.createEmergency).patch(emergencyController.updateMyEmergencyLocation)["delete"](emergencyController.deleteMyEmergency);
router.route('/:id').get(emergencyController.getEmergencyLocation);
router.get('/within/:distance/center/:latlng/unit/:unit', emergencyController.getEmergencies);
module.exports = router;