const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', userController.getHome);
router.get('/museums', isAuthenticated, userController.getMuseums);
router.get('/museums/:id', isAuthenticated, userController.getMuseumDetails);

module.exports = router;
