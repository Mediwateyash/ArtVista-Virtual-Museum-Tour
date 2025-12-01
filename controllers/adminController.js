const { User, Museum, Section, Artifact, Booking } = require('../models');

const getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const todaysVisitors = await Booking.countDocuments({
            visitDate: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
        });

        // Simple aggregation for most visited museum (based on bookings)
        const mostVisitedMuseum = await Booking.aggregate([
            { $group: { _id: "$museumId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        let topMuseumName = 'N/A';
        if (mostVisitedMuseum.length > 0) {
            const m = await Museum.findById(mostVisitedMuseum[0]._id);
            if (m) topMuseumName = m.name;
        }

        res.render('admin/dashboard', {
            totalUsers,
            totalBookings,
            todaysVisitors,
            topMuseumName
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Museum CRUD
const getMuseums = async (req, res) => {
    const museums = await Museum.find();
    res.render('admin/museums/index', { museums });
};

const getAddMuseum = (req, res) => res.render('admin/museums/add');

const postAddMuseum = async (req, res) => {
    try {
        await Museum.create(req.body);
        res.redirect('/admin/museums');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding museum');
    }
};

const getEditMuseum = async (req, res) => {
    const museum = await Museum.findById(req.params.id);
    res.render('admin/museums/edit', { museum });
};

const putEditMuseum = async (req, res) => {
    try {
        await Museum.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/admin/museums');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating museum');
    }
};

const deleteMuseum = async (req, res) => {
    try {
        await Museum.findByIdAndDelete(req.params.id);
        res.redirect('/admin/museums');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting museum');
    }
};

// Section CRUD
const getSections = async (req, res) => {
    const sections = await Section.find().populate('museumId');
    res.render('admin/sections/index', { sections });
};

const getAddSection = async (req, res) => {
    const museums = await Museum.find();
    res.render('admin/sections/add', { museums });
};

const postAddSection = async (req, res) => {
    try {
        await Section.create(req.body);
        res.redirect('/admin/sections');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding section');
    }
};

const getEditSection = async (req, res) => {
    const section = await Section.findById(req.params.id);
    const museums = await Museum.find();
    res.render('admin/sections/edit', { section, museums });
};

const putEditSection = async (req, res) => {
    try {
        await Section.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/admin/sections');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating section');
    }
};

const deleteSection = async (req, res) => {
    try {
        await Section.findByIdAndDelete(req.params.id);
        res.redirect('/admin/sections');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting section');
    }
};

// Artifact CRUD
const getArtifacts = async (req, res) => {
    const artifacts = await Artifact.find().populate('museumId').populate('sectionId');
    res.render('admin/artifacts/index', { artifacts });
};

const getAddArtifact = async (req, res) => {
    const museums = await Museum.find();
    const sections = await Section.find();
    res.render('admin/artifacts/add', { museums, sections });
};

const postAddArtifact = async (req, res) => {
    try {
        await Artifact.create(req.body);
        res.redirect('/admin/artifacts');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding artifact');
    }
};

const getEditArtifact = async (req, res) => {
    const artifact = await Artifact.findById(req.params.id);
    const museums = await Museum.find();
    const sections = await Section.find({ museumId: artifact.museumId });
    res.render('admin/artifacts/edit', { artifact, museums, sections });
};

const putEditArtifact = async (req, res) => {
    try {
        await Artifact.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/admin/artifacts');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating artifact');
    }
};

const deleteArtifact = async (req, res) => {
    try {
        await Artifact.findByIdAndDelete(req.params.id);
        res.redirect('/admin/artifacts');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting artifact');
    }
};

// Bookings
const getBookings = async (req, res) => {
    const bookings = await Booking.find().populate('userId').populate('museumId').sort({ createdAt: -1 });
    res.render('admin/bookings/index', { bookings });
};

const markVisited = async (req, res) => {
    try {
        await Booking.findByIdAndUpdate(req.params.id, { status: 'Visited' });
        res.redirect('/admin/bookings');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating booking');
    }
};

module.exports = {
    getDashboard,
    getMuseums, getAddMuseum, postAddMuseum, getEditMuseum, putEditMuseum, deleteMuseum,
    getSections, getAddSection, postAddSection, getEditSection, putEditSection, deleteSection,
    getArtifacts, getAddArtifact, postAddArtifact, getEditArtifact, putEditArtifact, deleteArtifact,
    getBookings, markVisited
};
