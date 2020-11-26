const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();
router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);
// router.use(authController.protect);

router.use(authController.isLoggedIn);

router.get('/', viewController.getHomePage);
router.get('/AllEmergencies', viewController.getAllEmergencies);

router.get(
  '/emergencies/:distance/:latlng/:unit',
  viewController.getEmergencies
);
router.get('/emergency/:id', viewController.getEmergency);
router.get('/account', viewController.getMyAccountDetails);
module.exports = router;
