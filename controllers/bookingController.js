const { Museum, Booking } = require('../models');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const getBookingForm = async (req, res) => {
    try {
        const museum = await Museum.findById(req.params.museumId);
        res.render('user/booking-form', { museum });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const processBooking = async (req, res) => {
    try {
        const { museumId, visitDate, timeSlot, ticketType, quantity } = req.body;
        const museum = await Museum.findById(museumId);

        // Calculate Amount (Dummy logic)
        let pricePerTicket = 0;
        if (ticketType === 'Adult') pricePerTicket = 500;
        else if (ticketType === 'Student') pricePerTicket = 200;
        else if (ticketType === 'Foreign') pricePerTicket = 1000;

        const totalAmount = pricePerTicket * quantity;
        const bookingId = 'BK' + Date.now();

        const newBooking = new Booking({
            bookingId,
            userId: req.session.user._id,
            museumId,
            ticketType,
            quantity,
            visitDate,
            timeSlot,
            totalAmount
        });

        await newBooking.save();
        res.redirect(`/bookings/success/${newBooking._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Booking Failed');
    }
};

const getSuccess = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('museumId');
        res.render('user/booking-success', { booking });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const downloadTicket = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('museumId').populate('userId');

        const doc = new PDFDocument();
        const filename = `ticket-${booking.bookingId}.pdf`;

        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // PDF Content
        doc.fontSize(25).text('ArtVista Museum Ticket', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Booking ID: ${booking.bookingId}`);
        doc.text(`Museum: ${booking.museumId.name}`);
        doc.text(`Visitor: ${booking.userId.name}`);
        doc.text(`Date: ${booking.visitDate.toDateString()}`);
        doc.text(`Time: ${booking.timeSlot}`);
        doc.text(`Type: ${booking.ticketType}`);
        doc.text(`Quantity: ${booking.quantity}`);
        doc.moveDown();
        doc.fontSize(20).text(`Total Amount: Rs. ${booking.totalAmount}`, { align: 'right' });
        doc.moveDown();
        doc.fontSize(12).text('Please show this ticket at the entry gate.', { align: 'center' });

        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating ticket');
    }
};

module.exports = { getBookingForm, processBooking, getSuccess, downloadTicket };
