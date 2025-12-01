const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register', (req, res) => res.render('user/register', { error: null }));
router.post('/register', authController.register);

router.get('/login', (req, res) => res.render('user/login', { error: null }));
router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports = router;
