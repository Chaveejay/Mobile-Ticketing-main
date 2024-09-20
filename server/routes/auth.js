const express = require('express');
const router = express.Router();
const authController = require(`../controllers/authController`)
const verifyToken = require('../middleware/verifyToken');

router.route('/register').post(authController.signUp);
router.route('/login').post(authController.signIn);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password').post(authController.resetPassword);
router.route('/profile').get(verifyToken(), authController.getUserProfile);
router.route('/update-profile').put(verifyToken(), authController.updateProfile);
router.route('/logout').post(verifyToken(), authController.logout);


module.exports = router;