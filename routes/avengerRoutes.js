const express = require('express');
const avengerController = require('../controllers/avengersController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/').post(avengerController.createAvenger);

router.route('/:id').delete(avengerController.deleteAvenger);

module.exports = router;
