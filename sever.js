const express = require('express');
const app = express();
const methodOverride = require('method-override');
const port = 3000;
require('dotenv').config();

const mongoose = require('mongoose');
app.use(methodOverride('_method'));

mongoose.set('strictQuery', false);
const SeedData = require('./models/seed.js');
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
// app.get('/manga/seed', (req, res) => {
//     Manga.create(SeedData, (err, createdMangaData) => {
//     res.send(createdMangaData);
//     });
// });

//index
app.get('/manga', (req, res) => {
    res.render('index.ejs');
    Manga.find({}, (err, mangaData) => {
        res.render('index.ejs', {
            mangaHome: mangaData
        });
    });
})

//show
app.get('/manga/:id', (req, res)=> {
    Manga.findById(req.params.id, (err, showMangaData) => {
        res.render('show.ejs', {
            manga: showMangaData
        });
    });
})

//destroy
app.delete('/manga/:id', (req, res) => {
    Manga.findByIdAndDelete(req.params.id, (err, deletedMangaData) => {
        res.redirect('/manga');
    });
});
//edit
app.get('/manga/:id/edit', (req, res) => {
    Manga.findById(req.params.id, (err, foundMangaData) => {
    res.render('edit.ejs');
    });
});
//update
app.put('/manga/:id', (req, res) => {
    Manga.findByIdandUpdate(req.params.id, req.body, (err, updatedMangaData) => {
        res.redirect('/manga');
    });
});
//listeners
mongoose.connect(process.env.MONGODB, () => {
	console.log('connection to mongo is established');
});

app.listen(port, () => {
	console.log(`ecom app listening on port: ${port}`);
});