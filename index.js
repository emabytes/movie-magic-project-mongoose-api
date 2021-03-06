require('dotenv').config()
const { render } = require('ejs');
const express = require('express');
const PORT = process.env.PORT || 3003;
const app = express()
const mongoose = require('mongoose');
const fetch = require("node-fetch")
const movieItem = require('./models/movieItem');

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs')

const dbURI = `${process.env.dbURI}`
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("connected to db")
        app.listen(PORT, () => {
            console.log("server listening at http://localhost:3003")
        })
        .catch(err => console.log(err))
    })

let data = []
let pageNumber = 1
app.get("/", (req, res) => {

    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=en-US&page=1`)
        .then(res => res.json())
        .then(json => {
            // console.log(json)
            res.render("index", { data: json.results, pageNumber: pageNumber })
        })
    .catch(err=>console.log(err))
})

app.get("/page/:id", (req, res) => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=en-US&page=${req.params.id}`)
        .then(res => res.json())
        .then(json => {
            // console.log(json)
            if (req.params.id > 500) {
                req.params.id = 500
            }
            res.render("index", { data: json.results, pageNumber: req.params.id })
        })
        .catch(err=>console.log(err))
})

app.get("/details/:id", (req, res) => {
    fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.API_KEY}&language=en-US`)
        .then(res => res.json())
        .then(json => {
            // console.log(json)
            res.render("details", { movieDetails: json })
        })
        .catch(err=>console.log(err))
})

app.post("/search", (req, res) => {
    res.redirect(`/search/${req.body.search}/1`)
})

app.get("/search/:query/:page", (req, res) => {
    console.log(req.params.search)
    fetch(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.API_KEY}&language=en-US&query=${req.params.query}&page=${req.params.page}&include_adult=false`)
        .then(res => res.json())
        .then(json => {
            //console.log(json)
            let newData = json.results.filter(elt => {
                if (("genre_ids" in elt)) {
                    return elt
                }
            })
            console.log(newData)
            res.render("results", { data: newData })
        })
        .catch(err => console.log('The error while searching movies occurred: ', err))
})

app.get("/favs", (req, res) => {
    movieItem.find()
        .then((result) => {
            res.render("favs", { data: result })
        })
        .catch(err=>console.log(err))
})

app.get("/addFav/:id", (req, res) => {
    fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.API_KEY}&language=en-US`)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            const newFav = new movieItem({
                title: data.title,
                backdrop_path: data.backdrop_path,
                poster_path: data.poster_path,
                release_date: data.release_date,
                status: data.status,
                vote_average: data.vote_average,
                genres: data.genres,
                overview: data.overview,
            })
            newFav.save()
                .then(result => {
                    console.log("saved to db")
                    res.redirect("/favs")
                })
                .catch(err => console.log(err))
        })
        .catch(err=>console.log(err))

});

app.get("/favs/:id", (req, res) => {
    movieItem.findById(req.params.id)
        .then(result => {
            res.render('favDetails', { movieDetails: result })
        })
        .catch(err => console.log(err))
})

app.get("/removeFav/:id", (req, res) => {
    movieItem.findByIdAndDelete(req.params.id)
        .then(result => {
            res.redirect("/favs")
        })
        .catch(err => console.log(err))
});




