const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const authController = require('../app/controllers/AuthController');

router.get('/information', authController.protect, authController.isLoggedIn, userController.info);
router.post('/register', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/stored', authController.protect, authController.isLoggedIn, userController.stored);
router.put('/stored/:id', authController.protect, authController.isLoggedIn, userController.update);
router.get('/:id/edit', authController.protect, authController.isLoggedIn, userController.edit);


module.exports = router;
