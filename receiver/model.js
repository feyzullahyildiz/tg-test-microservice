// import mongoose from 'mongoose';
const mongoose = require('mongoose');
const { Schema } = mongoose;


const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const locationSchema = new Schema({
    courierId: mongoose.ObjectId, // String is shorthand for {type: String}
    date: { type: Date, default: Date.now },
    location: {
        type: pointSchema,
        required: true,
        index: '2dsphere'
    }
});

module.exports = {
    locationSchema
}