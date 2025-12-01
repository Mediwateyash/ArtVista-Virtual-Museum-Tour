const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/book/:museumId', bookingController.getBookingForm);
router.post('/book', bookingController.processBooking);
router.get('/success/:id', bookingController.getSuccess);
router.get('/download/:id', bookingController.downloadTicket);

module.exports = router;
