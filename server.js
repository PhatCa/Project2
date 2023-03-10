const express = require('express');
const app = express();
const methodOverride = require('method-override');
const port = process.env.PORT || 3000;
const bcrypt = require('bcryptjs');
const session = require('express-session');
require('dotenv').config();

const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const sessionStore = MongoStore.create({
	mongoUrl: process.env.MONGODB,
	mongooseConnection: mongoose.connection,
	collectionName: 'session',
});

app.use(express.urlencoded({ entended: false }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(
	session({
		secret: 'sdlmadlamldasldanlwlrlqmlmlamslaladlmqlmlqa',
		resave: false,
		saveUninitialized: true,
		store: sessionStore,
		cookie: { secure: false },
	})
);

mongoose.set('strictQuery', false);

const SeedData = require('./models/seed.js');
const Manga = require('./models/mangaSchema.js');
const User = require('./models/userSchema.js');

//new
app.get('/manga/new', (req, res) => {
	Manga.find({}, (err, allManga) => {
		if (err) {
			console.log(err);
		} else {
			res.render('new.ejs', {
				manga: allManga,
			});
		}
	});
});

//create
app.post('/manga/new', (req, res) => {
	if (req.body.new === 'on') {
		req.body.new = true;
	} else {
		req.body.new = false;
	}
	Manga.create(req.body, (err, data) => {
		console.log('req body', req.body);
		res.redirect('/manga');
	});
});
// seed
// app.get('/manga/seed', (req, res) => {
//     Manga.create(SeedData, (err, createdMangaData) => {
//     res.send(createdMangaData);
//     });
// });

//index
app.get('/manga', (req, res) => {
	Manga.find({}, (err, mangaData) => {
		res.render('index.ejs', {
			mangaHome: mangaData,
		});
	});
});

//show
app.get('/manga/:id', (req, res) => {
	Manga.findById(req.params.id, (err, showMangaData) => {
		res.render('show.ejs', {
			manga: showMangaData,
		});
	});
});

//destroy
app.delete('/manga/:id', (req, res) => {
	Manga.findByIdAndDelete(req.params.id, (err, deletedMangaData) => {
		res.redirect('/manga');
	});
});
//edit
app.get('/manga/:id/edit', (req, res) => {
	Manga.findById(req.params.id, (err, foundMangaData) => {
		res.render('edit.ejs', {
			mangaEdit: foundMangaData,
		});
	});
});
//update
app.put('/manga/:id', (req, res) => {
	// console.log(req.body);
	Manga.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, updatedMangaData) => {
            res.redirect('/manga');
        }
	);
});

//Redirecting page from render
app.get('/', (req, res) => {
	res.redirect('/manga');
});

//Register
app.get('/register', (req, res) => {
	res.render('register.ejs');
});

app.post('/register', async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const user = await User.create({ ...req.body, password: hashedPassword });
		res.render('login.ejs');
	} catch (error) {
		console.log(error);
		res.status(500).send('Server Error');
	}
});

//Login
app.get('/login', (req, res) => {
	res.render('login.ejs');
});

app.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			const checkPassword = await bcrypt.compare(
				req.body.password,
				user.password
			);
			if (checkPassword) {
				req.session.username = user.username
				const manga = await Manga.find();
				res.render('userPage.ejs', {
					user: user,
					manga: manga,
				});
			} else {
				res.send('No Password Found');
			}
		} else {
			res.send('No User Found');
		}
	} catch (error) {
		console.log(error);
	}
});

//Add manga route
app.post('/cart/add/:id', async (req, res) => {
	const user = await User.findOne({ email: req.body.email });
	const mangaId = req.params.id;
    user.cart.push(mangaId);
    await user.save()
    const manga = await Manga.find({});
    res.render('userPage.ejs', {
		user: user,
		manga: manga,
	});

    
	
});

//Spread operator
//find manga by the id = manga
//const user = find user
//user.cart.push(manga.id)

//splice for remove

//Log out
app.post('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/login');
		}
	});
});
//Show cart
app.get('/cart',async(req,res)=>{
    const user = await User.findOne({username: req.session.username}).populate('cart')
    res.render('userCart.ejs',{
        user: user,
    })
})

//Route to user main page
app.get('/user',async(req,res)=>{
    const user = await User.findOne({ username: req.session.username}).populate('cart')
    const manga = await Manga.find({})
    res.render('userPage.ejs',{
        user:user,
        manga:manga
    })
})

//route to remove item from cart
app.post('/cart/remove/:id',async(req,res)=>{
    const user = await User.findOne({username:req.session.username});
    const mangaId = req.params.id;
    const index = user.cart.indexOf(mangaId);
    if(index !== -1){
        user.cart.splice(index,1)
    }
    await user.save()
    res.redirect('/cart')
})

//User Show page
app.get('/user/:id/show',async(req,res)=>{
	const user = await User.findOne({username: req.session.username})
	Manga.findById(req.params.id, (err, showMangaData) => {
			res.render('userShow.ejs', {
				manga: showMangaData,
			});
		});
	});



//listeners
mongoose.connect(process.env.MONGODB, () => {
	console.log('connection to mongo is established');
});

app.listen(port, () => {
	console.log(`ecom app listening on port: ${port}`);
});
