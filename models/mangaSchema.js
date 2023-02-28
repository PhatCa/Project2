const mongoose = require('mongoose')

const animeSchema = new mongoose.Schema({
    name: {type:String, required:true},
    issue:{type:Number,required:true},
    publisher:{type:String,required:true},
    img:{type:String,required:true},
    new: {type:Boolean, default:false},
    condition:{type:String, enum:["normal","rare","exotic"],default:"normal"},
    price:{type:Number,require:true}
})

const Manga = mongoose.model('Manga',animeSchema)
module.exports= Manga