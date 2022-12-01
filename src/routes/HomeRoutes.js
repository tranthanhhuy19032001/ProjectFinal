const express = require('express');
const router = express.Router();
const homeController = require('../app/controllers/HomeController');
const authController = require('../app/controllers/AuthController');

router.get('/', authController.isLoggedIn, homeController.show);
router.get('/research', homeController.research);
router.get('/dangky', homeController.dangky);
router.get('/dangnhap', homeController.dangnhap);
router.get('/huongdan', authController.isLoggedIn, homeController.huongdan);
router.get('/create', authController.isLoggedIn, homeController.create);
router.post('/create/store', authController.isLoggedIn, homeController.store);
router.get('/chothuephongtro', authController.isLoggedIn, homeController.showPT);
router.get('/:slug', authController.isLoggedIn, homeController.chitietPT);

module.exports = router;