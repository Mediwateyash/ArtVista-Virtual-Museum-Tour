const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/:museumId', tourController.getTourIntro);
router.get('/start/:museumId/:sectionId', tourController.startTour);
router.get('/view/:progressId', tourController.getTourViewer);
router.post('/next/:progressId', tourController.nextItem);
router.post('/prev/:progressId', tourController.prevItem);

module.exports = router;
