const express = require('express');
const authController = require('../controllers/authController');
const emergencyController = require('../controllers/emergencyController');

const router = express.Router();

// Logged IN users only
router.use(authController.protect);

router
  .route('/')
  .get(emergencyController.createEmergency)
  .patch(emergencyController.updateMyEmergencyLocation)
  .delete(emergencyController.deleteMyEmergency);

router.route('/:id').get(emergencyController.getEmergencyLocation);

router.get(
  '/within/:distance/center/:latlng/unit/:unit',
  emergencyController.getEmergencies
);

module.exports = router;
