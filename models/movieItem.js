const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieItemSchema = new Schema({
    title: {
        type: String,
        // required: true
    },
    backdrop_path: {
        type: String,
        // required: true
    },
    poster_path: {
        type: String,
        // required: true
    },
    release_date: {
        type: String,
        // required: true
    },
    status: {
        type: String,
        // required: true
    },
    vote_average: {
        type: Number,
        // required: true
    }, 
    genres: {
        type: Array,
        // required: true
    },
    overview: {
        type: String,
        // required: true
    }
})

const movieItem = mongoose.model("moviedb", movieItemSchema)
module.exports = movieItem;