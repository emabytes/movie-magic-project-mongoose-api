const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieItemSchema = new Schema({
    title: {
        type: String,
    }
})