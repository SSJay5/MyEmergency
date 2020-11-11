const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// LOGGEDIN USER
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.delete('/deleteMe', userController.deleteMe);
router.patch('/updateMe', userController.updateMe);
router.patch('/addHelpingLocation', userController.addDefaultHelpingLocation);
// ADMIN Controlls
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
