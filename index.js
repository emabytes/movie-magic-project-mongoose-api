require('dotenv').config()
const express = require('express');
const PORT = process.env.PORT || 3113;
const app = express()
const mongoose = require('mongoose');
const fetch = require("node-fetch")

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs')

app.listen(PORT, () => {
    console.log("server listening at http://localhost:3113")
})

let data = []

app.get("/", (req, res) => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=en-US&page=1`)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            data = json
            res.render("index", { data })
        });
})

app.get("/page/:id", (req, res) => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=en-US&page=${req.params.id}`)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            data = json
            res.render("index", { data })
        });
})

app.get("/details/:id", (req, res) => {
    fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.API_KEY}&language=en-US`)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            data = json
            res.render("details", { movieDetails: data })
        });
})