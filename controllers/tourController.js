const { Museum, Section, Artifact, TourProgress } = require('../models');

const getTourIntro = async (req, res) => {
    try {
        const museum = await Museum.findById(req.params.museumId);
        const sections = await Section.find({ museumId: req.params.museumId });
        res.render('user/tour-intro', { museum, sections });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const startTour = async (req, res) => {
    try {
        const { museumId, sectionId } = req.params;
        const userId = req.session.user._id;

        // Check if progress exists, if not create
        let progress = await TourProgress.findOne({ userId, museumId, sectionId });
        if (!progress) {
            const totalItems = await Artifact.countDocuments({ sectionId });
            progress = await TourProgress.create({
                userId,
                museumId,
                sectionId,
                totalItems,
                currentIndex: 0
            });
        }

        res.redirect(`/tour/view/${progress._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const getTourViewer = async (req, res) => {
    try {
        const progress = await TourProgress.findById(req.params.progressId)
            .populate('museumId')
            .populate('sectionId');

        if (!progress) return res.status(404).send('Tour not found');

        const artifacts = await Artifact.find({ sectionId: progress.sectionId._id });
        const currentArtifact = artifacts[progress.currentIndex];

        res.render('user/tour-viewer', {
            progress,
            artifact: currentArtifact,
            isLast: progress.currentIndex >= artifacts.length - 1,
            isFirst: progress.currentIndex === 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const nextItem = async (req, res) => {
    try {
        const progress = await TourProgress.findById(req.params.progressId);
        if (progress.currentIndex < progress.totalItems - 1) {
            progress.currentIndex += 1;
            progress.lastVisitedAt = Date.now();
            await progress.save();
        }
        res.redirect(`/tour/view/${progress._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const prevItem = async (req, res) => {
    try {
        const progress = await TourProgress.findById(req.params.progressId);
        if (progress.currentIndex > 0) {
            progress.currentIndex -= 1;
            progress.lastVisitedAt = Date.now();
            await progress.save();
        }
        res.redirect(`/tour/view/${progress._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = { getTourIntro, startTour, getTourViewer, nextItem, prevItem };
