const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);


//new


//create


//seed


//index


//show


//destroy


//edit


//update


//listeners
mongoose.connect(process.env.MONGODB, () => {
	console.log('connection to mongo is established');
});

app.listen(port, () => {
	console.log(`pokedex app listening on port: ${port}`);
});