const express = require('express');
const app = express();
const methodOverride = require('method-override');
const port = 3000;
require('dotenv').config();

const mongoose = require('mongoose');
app.use(methodOverride('_method'));

mongoose.set('strictQuery', false);
// const SeedData = require('./models/seed.js');
const Manga = require('./models/mangaSchema.js');


//new
app.get('/manga/new', (req, res) => {
    res.render('new.ejs');
})

//create
app.post('/manga/', (req, res) => {
    Manga.create(req.params.id, (err, data) => {
        res.redirect('/manga');
    })
})
//seed
app.get('/manga/seed', (req, res) => {
    Manga.create(SeedData, (err, createdMangaData) => {
    res.send(createdMangaData);
    });
});

//index
app.get('/manga', (req, res) => {
    res.render('index.ejs');
    Manga.find({}, (err, mangaData) => {
        res.render('index.ejs', {

        });
    });
})

//show


//destroy


//edit
app.get('/manga/:id', (req, res) => {
    res.render('edit.ejs');
});
//update


//listeners
mongoose.connect(process.env.MONGODB, () => {
	console.log('connection to mongo is established');
});

app.listen(port, () => {
	console.log(`pokedex app listening on port: ${port}`);
});