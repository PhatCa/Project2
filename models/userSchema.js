const mongoose = require('mongoose')
const Manga = require('./mangaSchema');


const userSchema = new mongoose.Schema({
    username: {type:String, required:true,unique:true},
    password:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    cart:[Manga.schema]
})

const user = mongoose.model('User',userSchema)
module.exports = user