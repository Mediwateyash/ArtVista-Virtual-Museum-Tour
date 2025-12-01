const { Museum } = require('../models');

const getHome = (req, res) => {
    res.render('user/home', { title: 'ArtVista - Virtual Museum Tour' });
};

const getMuseums = async (req, res) => {
    try {
        const museums = await Museum.find();
        res.render('user/museums', { title: 'Explore Museums', museums });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const getMuseumDetails = async (req, res) => {
    try {
        const museum = await Museum.findById(req.params.id);
        if (!museum) return res.status(404).send('Museum not found');
        res.render('user/museum-details', { title: museum.name, museum });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = { getHome, getMuseums, getMuseumDetails };
