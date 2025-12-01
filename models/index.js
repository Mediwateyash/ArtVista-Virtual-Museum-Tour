const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Museum Schema
const MuseumSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    timings: { type: String, required: true },
    imageUrl: { type: String, required: true }
});

// Section Schema
const SectionSchema = new Schema({
    name: { type: String, required: true },
    museumId: { type: Schema.Types.ObjectId, ref: 'Museum', required: true }
});

// Artifact Schema
const ArtifactSchema = new Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    period: { type: String, required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    museumId: { type: Schema.Types.ObjectId, ref: 'Museum', required: true }
});

// Booking Schema
const BookingSchema = new Schema({
    bookingId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    museumId: { type: Schema.Types.ObjectId, ref: 'Museum', required: true },
    ticketType: { type: String, enum: ['Adult', 'Student', 'Foreign'], required: true },
    quantity: { type: Number, required: true },
    visitDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Booked' },
    createdAt: { type: Date, default: Date.now }
});

// Tour Progress Schema
const TourProgressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    museumId: { type: Schema.Types.ObjectId, ref: 'Museum', required: true },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
    currentIndex: { type: Number, default: 0 },
    totalItems: { type: Number, required: true },
    lastVisitedAt: { type: Date, default: Date.now }
});

module.exports = {
    User: mongoose.model('User', UserSchema),
    Museum: mongoose.model('Museum', MuseumSchema),
    Section: mongoose.model('Section', SectionSchema),
    Artifact: mongoose.model('Artifact', ArtifactSchema),
    Booking: mongoose.model('Booking', BookingSchema),
    TourProgress: mongoose.model('TourProgress', TourProgressSchema)
};
