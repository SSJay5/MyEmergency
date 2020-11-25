"use strict";

var express = require('express');

var avengerController = require('../controllers/avengersController');

var authController = require('../controllers/authController');

var router = express.Router();
router.use(authController.protect);
router.route('/').post(avengerController.createAvenger);
router.route('/:id')["delete"](avengerController.deleteAvenger);
module.exports = router;