const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

router.use(isAdmin); // Protect all admin routes

router.get('/dashboard', adminController.getDashboard);

// Museums
router.get('/museums', adminController.getMuseums);
router.get('/museums/add', adminController.getAddMuseum);
router.post('/museums', adminController.postAddMuseum);
router.get('/museums/edit/:id', adminController.getEditMuseum);
router.put('/museums/:id', adminController.putEditMuseum);
router.delete('/museums/:id', adminController.deleteMuseum);

// Sections
router.get('/sections', adminController.getSections);
router.get('/sections/add', adminController.getAddSection);
router.post('/sections', adminController.postAddSection);
router.get('/sections/edit/:id', adminController.getEditSection);
router.put('/sections/:id', adminController.putEditSection);
router.delete('/sections/:id', adminController.deleteSection);

// Artifacts
router.get('/artifacts', adminController.getArtifacts);
router.get('/artifacts/add', adminController.getAddArtifact);
router.post('/artifacts', adminController.postAddArtifact);
router.get('/artifacts/edit/:id', adminController.getEditArtifact);
router.put('/artifacts/:id', adminController.putEditArtifact);
router.delete('/artifacts/:id', adminController.deleteArtifact);

// Bookings
router.get('/bookings', adminController.getBookings);
router.put('/bookings/:id/visited', adminController.markVisited);

// Users
router.get('/users', adminController.getUsers);
router.put('/users/:id/make-admin', adminController.makeAdmin);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
