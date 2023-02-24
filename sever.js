const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
// const SeedData = require('./models/seed.js');
const Manga = require('./models/mangaSchema.js');


//new


//create


//seed
app.get('/', (req, res) => {
    Manga.create(SeedData, (err, createdMangaData) => {
    res.send(createdMangaData);
    });
});

//index
app.get('/manga', (req, res) => {
    res.render('index.ejs');
    
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